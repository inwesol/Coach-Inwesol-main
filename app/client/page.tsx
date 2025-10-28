// app/page.tsx or your main client page
'use client';

import { useState, useEffect } from 'react';
import { Search, Mail, X, User, Calendar, ArrowLeft, FileText } from 'lucide-react';
import ClientSummaryModal from '@/components/ClientSummaryModal';

interface Client {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  email_verified: boolean;
  created_at?: string;
  updated_at?: string;
  session_id?: number | null;
}

interface Coach {
  id: string;
  name: string;
  email: string;
  clients: Client[];
}

interface SessionItemData {
  [key: string]: any;
}

export default function ClientPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [selectedSession, setSelectedSession] = useState<number | null>(null);
  const [selectedSessionItem, setSelectedSessionItem] = useState<string | null>(null);
  const [sessionItemData, setSessionItemData] = useState<SessionItemData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isLoadingItemData, setIsLoadingItemData] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSummaryModal, setShowSummaryModal] = useState(false);

  const sessionContent: { [key: number]: { [key: string]: { table: string; columns: string[] } } } = {
    0: {
      'Demography Form': { table: 'demographics_details_form', columns: ['stress_level'] }
    },
    1: {
      'Pre Coaching Assessment': { table: 'pre_assessment', columns: ['answers'] },
      'Career Maturity': { table: 'career_maturity_assessment', columns: ['answers'] },
      'Psychological Wellbeing': { table: 'psychological_wellbeing_test', columns: ['score'] },
      'Strengths and Difficulties': { table: '', columns: [] },
      'Career Story – 1': { table: 'career_story_one', columns: ['transition_essay', 'occupations', 'heroes', 'media_preferences', 'favorite_story', 'favorite_saying'] }
    },
    2: {
      'RIASEC Test': { table: 'riasec_test', columns: ['selected_answers', 'category_counts', 'interest_code'] },
      'Personality Test': { table: 'personality_test', columns: ['score'] },
      'My Life Collage': { table: 'my_life_collage', columns: ['present_life_collage', 'future_life_collage'] }
    },
    3: {
      'Career Story – 2': { table: 'career_story_two', columns: ['first_adjectives', 'repeated_words', 'common_traits', 'significant_words', 'self_statement', 'media_activities', 'selected_riasec', 'setting_statement'] }
    },
    4: {
      'Letter/Advice from Future Self': { table: 'letter_from_future_self', columns: ['letter'] },
      'Career Story – 3': { table: 'career_story_three', columns: ['self_statement', 'setting_statement', 'plot_description', 'plot_activities', 'able_to_be_statement', 'places_where_statement', 'so_that_statement', 'motto_statement', 'selected_occupations'] }
    },
    5: {
      'Career Options Matrix': { table: '', columns: [] },
      'Career Story – 4': { table: 'career_story_four', columns: ['rewritten_story'] }
    },
    6: {
      'Career Story – 5 (Multiple Storyboard)': { table: 'career_story_five', columns: ['storyboards'] }
    },
    7: {
      'Career Story – 5 (Final Storyboard)': { table: 'career_story_five', columns: ['storyboards'] }
    },
    8: {
      'Daily Journaling': { table: 'daily_journaling', columns: ['date', 'took_action', 'what_held_back', 'challenges', 'progress', 'gratitude', 'gratitude_help', 'tomorrow_step'] },
      'Action Plan Implementation': { table: '', columns: [] },
      'Post Career Maturity': { table: 'post_career_maturity', columns: ['answers'] },
      'Post Assessments': { table: 'post_coaching_assessments', columns: ['answers'] },
      'Post Psychological Wellbeing': { table: 'post_psychological_wellbeing_test', columns: ['score'] },
      'Post Strengths and Weakness': { table: '', columns: [] }
    }
  };

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await fetch('/api/clients');
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.error || 'Failed to fetch clients');
        }
        
        setCoaches(data.data);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setIsLoading(false);
      }
    };

    fetchClients();
  }, []);

  const filteredCoaches = coaches.map(coach => ({
    ...coach,
    clients: coach.clients.filter(client =>
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(coach => coach.clients.length > 0 || searchQuery === '');

  const getSessionDisplay = (sessionId: number | null | undefined) => {
    if (sessionId === null || sessionId === undefined) {
      return '0';
    }
    if (sessionId === 9) {
      return 'Completed';
    }
    return `${sessionId}`;
  };

  const handleCloseModal = () => {
    setSelectedClient(null);
    setSelectedSession(null);
    setSelectedSessionItem(null);
    setSessionItemData(null);
    setShowSummaryModal(false);
  };

  const handleBackToSessions = () => {
    setSelectedSession(null);
    setSelectedSessionItem(null);
    setSessionItemData(null);
  };

  const handleBackToSessionItems = () => {
    setSelectedSessionItem(null);
    setSessionItemData(null);
  };

  const fetchSessionItemData = async (itemName: string) => {
    if (!selectedClient || selectedSession === null) return;
    
    const itemConfig = sessionContent[selectedSession]?.[itemName];
    if (!itemConfig || !itemConfig.table || itemConfig.columns.length === 0) {
      setSessionItemData({ message: 'No data configured for this item' });
      return;
    }

    setIsLoadingItemData(true);
    try {
      const response = await fetch(`/api/session-data?userId=${selectedClient.id}&table=${itemConfig.table}&columns=${itemConfig.columns.join(',')}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch data');
      }
      
      setSessionItemData(data.data);
    } catch (err) {
      console.error('Error fetching session item data:', err);
      setSessionItemData({ error: err instanceof Error ? err.message : 'Failed to fetch data' });
    } finally {
      setIsLoadingItemData(false);
    }
  };

  const handleSessionItemClick = (itemName: string) => {
    setSelectedSessionItem(itemName);
    fetchSessionItemData(itemName);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-500/5 to-green-500/5">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          <p className="text-gray-600 font-medium">Loading clients...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-red-50 to-red-100">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md">
          <div className="flex items-center space-x-3 text-red-600 mb-4">
            <X size={24} />
            <h2 className="text-xl font-semibold">Error</h2>
          </div>
          <p className="text-gray-700">{error}</p>
        </div>
      </div>
    );
  }

  const totalClients = coaches.reduce((sum, coach) => sum + coach.clients.length, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-500/5 to-green-500/5 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Clients</h1>
        </div>

        {totalClients > 0 && (
          <div className="mb-6">
            <div className="relative max-w-md">
              <input
                type="text"
                className="w-full p-3 pl-10 border-2 border-gray-200 rounded-lg focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all"
                placeholder="Search clients by name or email..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-blue-500" size={18} />
            </div>
          </div>
        )}

        <div className="space-y-6">
          {filteredCoaches.map((coach) => (
            <div key={coach.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
              <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4">
                <div className="flex items-center space-x-3">
                  <div className="text-white font-bold text-lg">
                    Clients
                  </div>
                </div>
              </div>

              <div className="p-6">
                {coach.clients.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {coach.clients.map((client) => (
                      <div
                        key={client.id}
                        className="border-2 border-gray-200 rounded-lg p-4 hover:border-blue-500 hover:shadow-md transition-all cursor-pointer bg-white hover:bg-gradient-to-br hover:from-blue-500/5 hover:to-green-500/5"
                        onClick={() => setSelectedClient(client)}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="flex-1 min-w-0">
                            <h3 className="font-semibold text-gray-800 truncate">
                              {client.name || 'Unnamed Client'}
                            </h3>
                            <p className="text-sm text-gray-600 truncate">{client.email}</p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <User size={48} className="mx-auto mb-2 opacity-50" />
                    <p>No clients assigned</p>
                  </div>
                )}
              </div>
            </div>
          ))}

          {filteredCoaches.length === 0 && searchQuery && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <Search size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600 mb-4">No clients found matching your search</p>
              <button
                className="px-4 py-2 border-2 border-blue-500 text-blue-500 rounded-lg hover:bg-blue-500 hover:text-white transition-all"
                onClick={() => setSearchQuery('')}
              >
                Clear search
              </button>
            </div>
          )}

          {coaches.length === 0 && (
            <div className="bg-white rounded-xl shadow-md p-12 text-center">
              <User size={48} className="mx-auto mb-4 text-gray-400" />
              <p className="text-gray-600">No coaches or clients available</p>
            </div>
          )}
        </div>
      </div>

      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 relative">
              <button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all"
              >
                <X size={20} />
              </button>
              {(selectedSession !== null || selectedSessionItem !== null) && (
                <button
                  onClick={selectedSessionItem ? handleBackToSessionItems : handleBackToSessions}
                  className="absolute top-4 left-4 text-white hover:bg-white/20 rounded-full p-2 transition-all flex items-center space-x-1"
                >
                  <ArrowLeft size={20} />
                </button>
              )}
              <div className="flex flex-col items-center text-center text-white">
                <h2 className="text-2xl font-bold">
                  {selectedSessionItem
                    ? selectedSessionItem
                    : selectedSession !== null 
                      ? `Session ${selectedSession}`
                      : selectedClient.name || 'Unnamed Client'
                  }
                </h2>
              </div>
            </div>

            <div className="p-6 space-y-4 overflow-y-auto flex-1">
              {selectedSessionItem !== null ? (
                <>
                  <div className="space-y-4">
                    {isLoadingItemData ? (
                      <div className="flex items-center justify-center py-12">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : sessionItemData ? (
                      sessionItemData.error ? (
                        <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4 text-center">
                          <p className="text-red-600">{sessionItemData.error}</p>
                        </div>
                      ) : sessionItemData.message ? (
                        <div className="bg-gray-50 border-2 border-gray-200 rounded-lg p-4 text-center">
                          <p className="text-gray-600">{sessionItemData.message}</p>
                        </div>
                      ) : (
                        <div className="space-y-3">
                          {Object.entries(sessionItemData).map(([key, value]) => (
                            <div key={key} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                              <p className="text-sm font-semibold text-gray-700 mb-2 capitalize">
                                {key.replace(/_/g, ' ')}
                              </p>
                              <div className="text-gray-800">
                                {key === 'heroes' && Array.isArray(value) ? (
                                  <div className="space-y-3">
                                    {value.map((hero: any, index: number) => (
                                      <div key={hero.id || index} className="bg-white p-3 rounded border border-gray-200">
                                        <p className="text-sm mb-1">
                                          <span className="font-semibold text-gray-700">Title:</span>{' '}
                                          <span className="text-gray-800">{hero.title}</span>
                                        </p>
                                        <p className="text-sm">
                                          <span className="font-semibold text-gray-700">Description:</span>{' '}
                                          <span className="text-gray-800">{hero.description}</span>
                                        </p>
                                      </div>
                                    ))}
                                  </div>
                                ) : (key === 'present_life_collage' || key === 'future_life_collage') && Array.isArray(value) ? (
                                  <div className="grid grid-cols-2 gap-3">
                                    {value.filter((item: any) => item.type === 'image' && item.content).map((item: any, index: number) => (
                                      <div key={item.id || index} className="bg-white p-2 rounded border border-gray-200">
                                        <img 
                                          src={item.content} 
                                          alt={`${key === 'present_life_collage' ? 'Present' : 'Future'} collage image ${index + 1}`}
                                          className="w-full h-auto rounded"
                                        />
                                      </div>
                                    ))}
                                  </div>
                                ) : (key === 'storyboards' || key === 'storyboard_data') && Array.isArray(value) ? (
                                  <div className="space-y-4">
                                    {value.map((storyboard: any, index: number) => (
                                      <div key={storyboard.id || index} className="bg-white p-4 rounded border border-gray-200">
                                        <h4 className="text-base font-bold text-gray-800 mb-3">
                                          {storyboard.name || `Storyboard ${index + 1}`}
                                        </h4>
                                        {storyboard.cells && Array.isArray(storyboard.cells) && (
                                          <div className="space-y-2">
                                            {storyboard.cells.map((cell: any, cellIndex: number) => (
                                              cell.content && cell.content.trim() && (
                                                <div key={cell.id || cellIndex} className="bg-gray-50 p-3 rounded border border-gray-100">
                                                  <p className="text-sm text-gray-800">{cell.content}</p>
                                                </div>
                                              )
                                            ))}
                                          </div>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : key === 'selected_riasec' && typeof value === 'object' && value !== null && !Array.isArray(value) ? (
                                  <div className="space-y-2">
                                    {Object.entries(value).map(([category, data]: [string, any]) => (
                                      <div key={category} className="bg-white p-3 rounded border border-gray-200">
                                        <p className="text-sm font-semibold text-gray-700 mb-1 uppercase">{category}</p>
                                        <p className="text-sm text-gray-800">{data.title || data}</p>
                                        {data.description && (
                                          <p className="text-xs text-gray-600 mt-1">{data.description}</p>
                                        )}
                                      </div>
                                    ))}
                                  </div>
                                ) : typeof value === 'object' && value !== null ? (
                                  <pre className="whitespace-pre-wrap text-sm bg-white p-3 rounded border border-gray-200 overflow-x-auto">
                                    {JSON.stringify(value, null, 2)}
                                  </pre>
                                ) : (
                                  <p className="text-sm">{String(value)}</p>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )
                    ) : null}
                  </div>
                </>
              ) : selectedSession === null ? (
                <>
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Mail size={20} className="text-blue-500" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Email</p>
                      <p className="text-gray-800">{selectedClient.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar size={20} className="text-green-500" />
                    <div>
                      <p className="text-xs text-gray-500 font-medium">Current Session</p>
                      <p className="text-gray-800 font-semibold">
                        {getSessionDisplay(selectedClient.session_id)}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-sm font-semibold text-gray-700 mb-3">Sessions</h3>
                    <div className="grid grid-cols-3 gap-3">
                      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((sessionNum) => {
                        const currentSession = selectedClient.session_id || 0;
                        const isActive = sessionNum === currentSession;
                        const isLocked = sessionNum > currentSession;
                        
                        return (
                          <div
                            key={sessionNum}
                            onClick={() => {
                              if (!isLocked) {
                                setSelectedSession(sessionNum);
                              }
                            }}
                            className={`
                              relative p-4 rounded-lg text-center font-semibold transition-all
                              ${isActive 
                                ? 'bg-blue-100 ring-2 ring-blue-300 cursor-pointer hover:shadow-md' 
                                : isLocked
                                  ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 cursor-pointer hover:shadow-md'
                              }
                            `}
                          >
                            <div className="text-sm">Session</div>
                            <div className="text-xl">{sessionNum}</div>
                            {isActive && (
                              <div className="absolute -top-1 -right-1 bg-green-500 text-white text-xs px-2 py-0.5 rounded-full">
                                Active
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </>
              ) : (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center mb-4">
                      <h3 className="text-lg font-semibold text-gray-800">Session Content</h3>
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowSummaryModal(true)}
                          className="px-4 py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center space-x-2"
                        >
                          <FileText size={18} />
                          <span>Write Summary</span>
                        </button>
                        <button
                          onClick={() => {
                            console.log('Joining session:', selectedSession);
                          }}
                          className="px-4 py-2 bg-gradient-to-r from-green-500 to-blue-500 text-white rounded-lg hover:shadow-lg transition-all font-medium flex items-center space-x-2"
                        >
                          <span>Join Session</span>
                        </button>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      {Object.keys(sessionContent[selectedSession] || {}).map((itemName, index) => (
                        <div 
                          key={index}
                          onClick={() => handleSessionItemClick(itemName)}
                          className="p-4 bg-gradient-to-br from-blue-50 to-green-50 rounded-lg border-2 border-blue-200 hover:border-blue-400 hover:shadow-md transition-all cursor-pointer"
                        >
                          <p className="text-sm font-medium text-gray-800">{itemName}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
            </div>

            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <button
                onClick={handleCloseModal}
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {selectedClient && selectedSession !== null && (
        <ClientSummaryModal
          isOpen={showSummaryModal}
          onClose={() => setShowSummaryModal(false)}
          clientId={selectedClient.id}
          sessionId={selectedSession}
          clientName={selectedClient.name || 'Unnamed Client'}
        />
      )}
    </div>
  );
}