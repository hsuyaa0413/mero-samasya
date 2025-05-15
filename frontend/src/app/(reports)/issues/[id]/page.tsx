'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  TriangleAlert,
} from 'lucide-react';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { backendApi } from '@/lib/constant';
import DashboardNav from '@/components/DashboardNav';
// import Map from '@/components/map';
import ImageGallery from '@/components/image-gallery';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';
import Link from 'next/link';

const Map = dynamic(() => import('@/components/map'), { ssr: false });

interface issue {
  id: string;
  title: string;
  description: string;
  mediaUrls: string[];
  location: string;
  lat: number;
  lng: number;
  category: string;
  status: 'pending' | 'inProgress' | 'resolved';
}

export default function IssuePage() {
  const params = useParams();
  const id = params.id as string;

  const [issue, setIssue] = useState<issue | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);

  useEffect(() => {
    const fetchissue = async () => {
      try {
        const response = await axios.get(`${backendApi}/report/${id}`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          const { issue } = response.data;
          console.log(response);
          setIssue(issue);
        }
      } catch (e) {
        console.error(`Error: ${e}`);
      }
    };

    if (id) {
      fetchissue();
    }
  }, [id]);

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'pending':
        return 'bg-red-100 text-red-800 hover:bg-red-200';
      case 'inProgress':
        return 'bg-yellow-100 text-yellow-800 hover:bg-yellow-200';
      case 'resolved':
        return 'bg-green-100 text-green-800 hover:bg-green-200';
      default:
        return 'bg-gray-100 text-gray-800 hover:bg-gray-200';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'pending':
        return <Clock className="h-4 w-4 mr-1" />;
      case 'inProgress':
        return <TriangleAlert className="h-4 w-4 mr-1" />;
      case 'resolved':
        return <CheckCircle className="h-4 w-4 mr-1" />;
      default:
        return null;
    }
  };

  return (
    <>
      <DashboardNav />
      <div className="container max-w-7xl mx-auto px-4 py-8 min-h-screen">
        <div className="flex justify-start max-w-5xl pl-28 mb-4">
          <Link
            href="/user-dashboard"
            className="flex items-center hover:underline"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Link>
        </div>

        <div className="flex justify-center">
          <Card className="container mb-8 max-w-5xl">
            <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <div>
                <CardTitle className="text-2xl font-bold">
                  {issue?.title}
                </CardTitle>
                <div className="flex items-center mt-2 text-muted-foreground">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{issue?.location}</span>
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="outline" className="font-medium">
                  {issue?.category}
                </Badge>
                <Badge
                  className={`flex items-center ${getStatusColor(
                    issue?.status
                  )}`}
                >
                  {getStatusIcon(issue?.status)}
                  <span className="capitalize">
                    {issue?.status === 'inProgress'
                      ? 'In Progress'
                      : issue?.status}
                  </span>
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">Description</h3>
                <p className="text-muted-foreground whitespace-pre-line">
                  {issue?.description}
                </p>
              </div>

              {issue?.mediaUrls && issue?.mediaUrls.length > 0 && (
                <div>
                  <h3 className="text-lg font-semibold mb-4">Images</h3>
                  <ImageGallery
                    images={issue?.mediaUrls}
                    onModalStateChange={setIsImageModalOpen}
                  />
                </div>
              )}

              {typeof issue?.lat === 'number' &&
                typeof issue?.lng === 'number' && (
                  <div>
                    <div
                      style={{ display: isImageModalOpen ? 'none' : 'block' }}
                    >
                      <h3 className="text-lg font-semibold mb-4">Location</h3>
                      <Map
                        position={[issue?.lat, issue?.lng]}
                        popupText={issue?.location}
                      />
                    </div>

                    <p className=" text-gray-600 mt-2">
                      Coordinates: Lat: {issue?.lat.toFixed(5)}, Lng:{' '}
                      {issue?.lng.toFixed(5)}
                    </p>
                  </div>
                )}
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
