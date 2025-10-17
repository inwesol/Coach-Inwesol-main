'use client';

import { useState, useEffect } from 'react';
import { Search, Mail, X, User } from 'lucide-react';

interface Client {
  id: string;
  name: string | null;
  email: string;
  image: string | null;
  email_verified: boolean;
  created_at?: string;
  updated_at?: string;
}

interface Coach {
  id: string;
  name: string;
  email: string;
  clients: Client[];
}

export default function ClientPage() {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [selectedClient, setSelectedClient] = useState<Client | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter clients based on search query
  const filteredCoaches = coaches.map(coach => ({
    ...coach,
    clients: coach.clients.filter(client =>
      client.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      client.email.toLowerCase().includes(searchQuery.toLowerCase())
    )
  })).filter(coach => coach.clients.length > 0 || searchQuery === '');

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
        {/* Header Section */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Clients</h1>
          
        </div>

        {/* Search Bar */}
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

        {/* Coaches List */}
        <div className="space-y-6">
          {filteredCoaches.map((coach) => (
            <div key={coach.id} className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow overflow-hidden border border-gray-100">
              {/* Coach Header */}
              <div className="bg-gradient-to-r from-blue-500 to-green-500 p-4">
                <div className="flex items-center space-x-3">
                  <div className=" text-white font-bold text-lg">
                    Clients
                  </div>
                </div>
              </div>

              {/* Clients Grid */}
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
                          {/* <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-green-500 flex items-center justify-center text-white font-semibold text-lg">
                            {client.name?.[0]?.toUpperCase() || '?'}
                          </div> */}
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

      {/* Client Details Modal */}
      {selectedClient && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl max-w-lg w-full shadow-2xl overflow-hidden">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-500 to-green-500 p-6 relative">
              <button
                onClick={() => setSelectedClient(null)}
                className="absolute top-4 right-4 text-white hover:bg-white/20 rounded-full p-2 transition-all"
              >
                <X size={20} />
              </button>
              <div className="flex flex-col items-center text-center text-white">
                <h2 className="text-2xl font-bold">{selectedClient.name || 'Unnamed Client'}</h2>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                <Mail size={20} className="text-blue-500" />
                <div>
                  <p className="text-xs text-gray-500 font-medium">Email</p>
                  <p className="text-gray-800">{selectedClient.email}</p>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="border-t border-gray-200 p-4 bg-gray-50">
              <button
                onClick={() => setSelectedClient(null)}
                className="w-full py-2 bg-gradient-to-r from-blue-500 to-green-500 text-white rounded-lg hover:shadow-lg transition-all font-medium"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}