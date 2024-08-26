import React from 'react';

interface Place {
  Place_Id: number;
  Place_Name: string;
  Category: string;
  Price: number;
}

interface Cluster {
  cluster_id: number;
  avg_price: number;
  places: Place[];
}

interface ClusterListProps {
  clusters: Cluster[];
}

const ClusterList: React.FC<ClusterListProps> = ({ clusters }) => {
  const formatPrice = (price: number): string => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(price);
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {clusters.map((cluster) => (
        <div key={cluster.cluster_id} className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-lg font-semibold mb-2">Cluster {cluster.cluster_id + 1}</h3>
          <p className="text-sm text-gray-600 mb-3">Avg Price: {formatPrice(cluster.avg_price)}</p>
          <ul className="text-sm space-y-1">
            {cluster.places.slice(0, 3).map((place) => (
              <li key={place.Place_Id} className="flex justify-between">
                <span className="truncate">{place.Place_Name}</span>
                <span className="text-gray-500">{formatPrice(place.Price)}</span>
              </li>
            ))}
          </ul>
          {cluster.places.length > 3 && (
            <p className="text-xs text-gray-500 mt-2">And {cluster.places.length - 3} more...</p>
          )}
        </div>
      ))}
    </div>
  );
};

export default ClusterList;