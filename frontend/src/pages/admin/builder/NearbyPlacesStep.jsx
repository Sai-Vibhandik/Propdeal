import { useState } from 'react';
import { MapPin, Plus, Trash2, Building2, ShoppingBag, Heart, Book, Car, Train, Utensils, Dumbbell, TreePine, Fuel, Banknote, Home } from 'lucide-react';

const placeTypes = [
  { value: 'school', label: 'School', icon: Book },
  { value: 'hospital', label: 'Hospital', icon: Heart },
  { value: 'shopping', label: 'Shopping Mall', icon: ShoppingBag },
  { value: 'work', label: 'IT Park / Office', icon: Building2 },
  { value: 'transport', label: 'Metro / Bus', icon: Train },
  { value: 'restaurant', label: 'Restaurant', icon: Utensils },
  { value: 'gym', label: 'Gym / Fitness', icon: Dumbbell },
  { value: 'park', label: 'Park', icon: TreePine },
  { value: 'bank', label: 'Bank / ATM', icon: Banknote },
  { value: 'fuel', label: 'Fuel Station', icon: Fuel },
  { value: 'other', label: 'Other', icon: MapPin },
];

const NearbyPlacesStep = ({ propertyData, updatePropertyData }) => {
  const [newPlace, setNewPlace] = useState({ name: '', distance: '', type: 'school' });

  // Initialize nearbyPlaces if not exists
  const nearbyPlaces = propertyData.nearbyPlaces || [];

  const handleAddPlace = () => {
    if (!newPlace.name.trim() || !newPlace.distance.trim()) {
      return;
    }

    const places = [...nearbyPlaces, { ...newPlace, id: Date.now() }];
    updatePropertyData('nearbyPlaces', places);
    setNewPlace({ name: '', distance: '', type: 'school' });
  };

  const handleRemovePlace = (index) => {
    const places = nearbyPlaces.filter((_, i) => i !== index);
    updatePropertyData('nearbyPlaces', places);
  };

  const handlePlaceChange = (index, field, value) => {
    const places = [...nearbyPlaces];
    places[index] = { ...places[index], [field]: value };
    updatePropertyData('nearbyPlaces', places);
  };

  const getTypeIcon = (type) => {
    const typeObj = placeTypes.find(t => t.value === type);
    return typeObj?.icon || MapPin;
  };

  const getTypeLabel = (type) => {
    const typeObj = placeTypes.find(t => t.value === type);
    return typeObj?.label || type;
  };

  return (
    <div className="space-y-8">
      {/* Section Header */}
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Nearby Places</h2>
        <p className="text-gray-600 mt-1">Add important places near your property</p>
      </div>

      {/* Add New Place Form */}
      <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Add New Place</h3>
        <div className="grid md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Place Name *
            </label>
            <input
              type="text"
              value={newPlace.name}
              onChange={(e) => setNewPlace({ ...newPlace, name: e.target.value })}
              placeholder="e.g., Phoenix Mall"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Distance *
            </label>
            <input
              type="text"
              value={newPlace.distance}
              onChange={(e) => setNewPlace({ ...newPlace, distance: e.target.value })}
              placeholder="e.g., 2 km"
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Type
            </label>
            <select
              value={newPlace.type}
              onChange={(e) => setNewPlace({ ...newPlace, type: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {placeTypes.map((type) => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={handleAddPlace}
              disabled={!newPlace.name.trim() || !newPlace.distance.trim()}
              className="w-full px-4 py-3 bg-blue-800 text-white rounded-xl font-medium hover:bg-blue-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
            >
              <Plus className="w-5 h-5" />
              Add Place
            </button>
          </div>
        </div>
      </div>

      {/* Added Places List */}
      {nearbyPlaces.length > 0 && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="p-4 bg-gray-50 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">
              Added Places ({nearbyPlaces.length})
            </h3>
          </div>
          <div className="divide-y divide-gray-100">
            {nearbyPlaces.map((place, index) => {
              const Icon = getTypeIcon(place.type);
              return (
                <div key={place.id || index} className="p-4 flex items-center gap-4">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Icon className="w-5 h-5 text-blue-800" />
                  </div>
                  <div className="flex-1 grid md:grid-cols-3 gap-4">
                    <div>
                      <input
                        type="text"
                        value={place.name}
                        onChange={(e) => handlePlaceChange(index, 'name', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Place name"
                      />
                    </div>
                    <div>
                      <input
                        type="text"
                        value={place.distance}
                        onChange={(e) => handlePlaceChange(index, 'distance', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Distance"
                      />
                    </div>
                    <div>
                      <select
                        value={place.type}
                        onChange={(e) => handlePlaceChange(index, 'type', e.target.value)}
                        className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        {placeTypes.map((type) => (
                          <option key={type.value} value={type.value}>
                            {type.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <button
                    onClick={() => handleRemovePlace(index)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Quick Add Suggestions */}
      <div className="bg-gray-50 rounded-xl p-6">
        <h3 className="text-sm font-medium text-gray-700 mb-3">Quick Add Suggestions</h3>
        <p className="text-sm text-gray-500 mb-4">
          Click on common places to quickly add them (you can edit distances later):
        </p>
        <div className="flex flex-wrap gap-2">
          {['Metro Station', 'Railway Station', 'Hospital', 'School', 'Shopping Mall', 'IT Park', 'Airport', 'Bus Stand', 'College', 'Market'].map((suggestion) => (
            <button
              key={suggestion}
              onClick={() => {
                const type = suggestion.toLowerCase().includes('metro') || suggestion.toLowerCase().includes('railway') || suggestion.toLowerCase().includes('bus')
                  ? 'transport'
                  : suggestion.toLowerCase().includes('hospital')
                  ? 'hospital'
                  : suggestion.toLowerCase().includes('school') || suggestion.toLowerCase().includes('college')
                  ? 'school'
                  : suggestion.toLowerCase().includes('mall') || suggestion.toLowerCase().includes('market')
                  ? 'shopping'
                  : suggestion.toLowerCase().includes('it') || suggestion.toLowerCase().includes('park')
                  ? 'work'
                  : 'other';

                if (!nearbyPlaces.some(p => p.name.toLowerCase() === suggestion.toLowerCase())) {
                  setNewPlace({ name: suggestion, distance: '', type });
                }
              }}
              disabled={nearbyPlaces.some(p => p.name.toLowerCase() === suggestion.toLowerCase())}
              className="px-3 py-1.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-700 hover:bg-blue-50 hover:border-blue-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {suggestion}
            </button>
          ))}
        </div>
      </div>

      {/* Tips */}
      <div className="bg-blue-50 rounded-xl p-6">
        <h3 className="font-medium text-blue-900 mb-2">Tips for adding nearby places</h3>
        <ul className="text-sm text-blue-800 space-y-2">
          <li>• Add 8-10 important places that buyers would care about</li>
          <li>• Include a mix of essential services (hospital, school) and lifestyle (mall, restaurant)</li>
          <li>• Be accurate with distances - buyers will verify</li>
          <li>• Mention major landmarks that people recognize</li>
        </ul>
      </div>
    </div>
  );
};

export default NearbyPlacesStep;