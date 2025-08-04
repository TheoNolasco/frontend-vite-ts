import React, { useState } from 'react';
import { authClient } from '../lib/auth';

interface Property {
  id: string;
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  sqft: number;
  type: string;
  status: string;
}

interface DetailedProperty extends Property {
  description?: string;
  yearBuilt?: number;
  lotSize?: number;
  garage?: number;
  features?: string[];
  images?: string[];
}

interface PropertiesResponse {
  success: boolean;
  data: Property[];
  meta: {
    total: number;
    user: string;
    timestamp: string;
  };
}

interface PropertyDetailResponse {
  success: boolean;
  data: DetailedProperty;
  meta: {
    timestamp: string;
  };
}

export const PropertiesTable: React.FC = () => {
  const [properties, setProperties] = useState<Property[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [hasLoaded, setHasLoaded] = useState(false);

  // Modal state
  const [selectedProperty, setSelectedProperty] = useState<DetailedProperty | null>(null);
  const [isModalLoading, setIsModalLoading] = useState(false);
  const [modalError, setModalError] = useState<string>('');

  const fetchProperties = async () => {
    setIsLoading(true);
    setError('');

    try {
      // Get the current session to include cookies in the request
      const session = await authClient.getSession();

      if (!session) {
        setError('You must be logged in to view properties');
        return;
      }

      console.log('Fetching properties...');

      const response = await fetch('http://localhost:3001/api/properties', {
        method: 'GET',
        credentials: 'include', // Important: include cookies for authentication
        headers: {
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Failed to fetch properties: ${response.status}`);
      }

      const data: PropertiesResponse = await response.json();
      console.log('Properties data:', data);

      setProperties(data.data);
      setHasLoaded(true);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err instanceof Error ? err.message : 'Failed to load properties');
    } finally {
      setIsLoading(false);
    }
  };

  const fetchPropertyDetails = async (propertyId: string) => {
    setIsModalLoading(true);
    setModalError('');

    try {
      const session = await authClient.getSession();

      if (!session) {
        setModalError('You must be logged in to view property details');
        return;
      }

      console.log(`Fetching details for property ${propertyId}...`);

      const response = await fetch(`http://localhost:3001/api/properties/${propertyId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          throw new Error('Authentication failed. Please log in again.');
        }
        throw new Error(`Failed to fetch property details: ${response.status}`);
      }

      const data: PropertyDetailResponse = await response.json();

      if (data.success) {
        setSelectedProperty(data.data);
        console.log('Property details loaded');
      } else {
        throw new Error('Failed to fetch property details');
      }
    } catch (err) {
      console.error('Error fetching property details:', err);
      setModalError(err instanceof Error ? err.message : 'Failed to fetch property details');
    } finally {
      setIsModalLoading(false);
    }
  };

  const handlePropertyClick = (property: Property) => {
    fetchPropertyDetails(property.id);
  };

  const closeModal = () => {
    setSelectedProperty(null);
    setModalError('');
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const getStatusBadge = (status: string) => {
    const statusColors = {
      'For Sale': 'badge-success',
      'For Rent': 'badge-info',
      'Sold': 'badge-neutral',
      'Pending': 'badge-warning',
    };

    return `badge ${statusColors[status as keyof typeof statusColors] || 'badge-primary'}`;
  };

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        <div className="flex justify-between items-center mb-4">
          <h2 className="card-title text-2xl">Properties</h2>
          <button
            className={`btn btn-primary ${isLoading ? 'loading' : ''}`}
            onClick={fetchProperties}
            disabled={isLoading}
          >
            {isLoading ? 'Loading...' : hasLoaded ? 'Refresh' : 'Load Properties'}
          </button>
        </div>

        {error && (
          <div className="alert alert-error mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        )}

        {properties.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="table table-zebra">
              <thead>
                <tr>
                  <th>Property</th>
                  <th>Price</th>
                  <th>Details</th>
                  <th>Type</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {properties.map((property) => (
                  <tr
                    key={property.id}
                    className="hover cursor-pointer"
                    onClick={() => handlePropertyClick(property)}
                  >
                    <td>
                      <div>
                        <div className="font-bold">{property.title}</div>
                        <div className="text-sm text-base-content/70">{property.address}</div>
                      </div>
                    </td>
                    <td className="font-bold text-primary">
                      {formatPrice(property.price)}
                    </td>
                    <td>
                      <div className="text-sm">
                        <div>{property.bedrooms} bed • {property.bathrooms} bath</div>
                        <div className="text-base-content/70">{property.sqft.toLocaleString()} sqft</div>
                      </div>
                    </td>
                    <td>
                      <span className="badge badge-outline">{property.type}</span>
                    </td>
                    <td>
                      <span className={getStatusBadge(property.status)}>
                        {property.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : hasLoaded && !isLoading ? (
          <div className="text-center py-8 text-base-content/70">
            No properties found.
          </div>
        ) : !hasLoaded && !isLoading ? (
          <div className="text-center py-8 text-base-content/70">
            Click "Load Properties" to fetch data from the server.
          </div>
        ) : null}

        {properties.length > 0 && (
          <div className="text-sm text-base-content/70 mt-4">
            Showing {properties.length} properties
          </div>
        )}
      </div>

      {/* Property Detail Modal */}
      {(selectedProperty || isModalLoading || modalError) && (
        <div className="modal modal-open">
          <div className="modal-box max-w-4xl">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-bold text-lg">
                {isModalLoading ? 'Loading Property Details...' :
                  modalError ? 'Error' :
                    selectedProperty?.title}
              </h3>
              <button
                className="btn btn-sm btn-circle btn-ghost"
                onClick={closeModal}
              >
                ✕
              </button>
            </div>

            {isModalLoading && (
              <div className="flex justify-center items-center py-8">
                <span className="loading loading-spinner loading-lg"></span>
              </div>
            )}

            {modalError && (
              <div className="alert alert-error">
                <span>{modalError}</span>
              </div>
            )}

            {selectedProperty && !isModalLoading && !modalError && (
              <div className="space-y-6">
                {/* Basic Info */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Property Details</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Address:</span> {selectedProperty.address}</p>
                      <p><span className="font-medium">Price:</span> <span className="text-primary font-bold">{formatPrice(selectedProperty.price)}</span></p>
                      <p><span className="font-medium">Type:</span> {selectedProperty.type}</p>
                      <p><span className="font-medium">Status:</span>
                        <span className={`ml-2 ${getStatusBadge(selectedProperty.status)}`}>
                          {selectedProperty.status}
                        </span>
                      </p>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold text-lg mb-2">Specifications</h4>
                    <div className="space-y-2">
                      <p><span className="font-medium">Bedrooms:</span> {selectedProperty.bedrooms}</p>
                      <p><span className="font-medium">Bathrooms:</span> {selectedProperty.bathrooms}</p>
                      <p><span className="font-medium">Square Feet:</span> {selectedProperty.sqft.toLocaleString()}</p>
                      {selectedProperty.yearBuilt && (
                        <p><span className="font-medium">Year Built:</span> {selectedProperty.yearBuilt}</p>
                      )}
                      {selectedProperty.lotSize && (
                        <p><span className="font-medium">Lot Size:</span> {selectedProperty.lotSize.toLocaleString()} sqft</p>
                      )}
                      {selectedProperty.garage && (
                        <p><span className="font-medium">Garage:</span> {selectedProperty.garage} car(s)</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {selectedProperty.description && (
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Description</h4>
                    <p className="text-base-content/80">{selectedProperty.description}</p>
                  </div>
                )}

                {/* Features */}
                {selectedProperty.features && selectedProperty.features.length > 0 && (
                  <div>
                    <h4 className="font-semibold text-lg mb-2">Features</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedProperty.features.map((feature, index) => (
                        <span key={index} className="badge badge-outline">
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            <div className="modal-action">
              <button className="btn" onClick={closeModal}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
