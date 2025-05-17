'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  ArrowLeft,
  CheckCircle,
  Clock,
  MapPin,
  SquarePen,
  TriangleAlert,
} from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import { backendApi } from '@/lib/constant';
import DashboardNav from '@/components/DashboardNav';
import ImageGallery from '@/components/image-gallery';
import { Badge } from '@/components/ui/badge';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { useUserStore } from '@/store/userStore';
import { Skeleton } from '@/components/ui/skeleton';

const Map = dynamic(() => import('@/components/map'), {
  ssr: false,
  loading: () => <Skeleton className="h-[400px] w-full rounded-md" />,
});

interface Issue {
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

  const [issue, setIssue] = useState<Issue | null>(null);
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { user } = useUserStore();

  const router = useRouter();
  const handleGoBack = () => {
    router.back();
  };

  useEffect(() => {
    const fetchissue = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(`${backendApi}/report/${id}`, {
          withCredentials: true,
        });

        if (response.status === 200) {
          const { issue } = response.data;
          setIssue(issue);
        }
      } catch (e) {
        console.error(`Error: ${e}`);
      } finally {
        setIsLoading(false);
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

  if (isLoading) {
    return (
      <>
        <DashboardNav />
        <div className="container max-w-7xl mx-auto px-4 py-8 min-h-screen">
          <div className="hidden sm:flex justify-start max-w-5xl pl-28 mb-4 ">
            <Button
              variant="outline"
              onClick={handleGoBack}
              className="flex items-center hover:underline cursor-pointer"
              disabled
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
          </div>

          <div className="flex justify-center">
            <Card className="container mb-8 max-w-5xl bg-gray-50">
              <CardHeader className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                  <Skeleton className="h-8 w-3/4 mb-2" />
                  <div className="flex items-center mt-2 text-muted-foreground">
                    <Skeleton className="h-4 w-4" />
                    <Skeleton className="h-4 w-1/2" />
                  </div>
                </div>
                <div className="flex justify-end gap-5 items-center">
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-8 w-20 rounded-md" />
                    <Skeleton className="h-8 w-24 rounded-md" />
                  </div>
                  {user?.role === 'authority' && (
                    <Skeleton className="h-10 w-32 rounded-md" />
                  )}
                </div>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <Skeleton className="h-6 w-1/4 mb-2" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-full mb-1" />
                  <Skeleton className="h-4 w-3/4 mb-1" />
                </div>

                <div>
                  <Skeleton className="h-6 w-1/4 mb-4" />
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                    <Skeleton className="aspect-square w-full rounded-md" />
                    <Skeleton className="aspect-square w-full rounded-md" />
                    <Skeleton className="aspect-square w-full rounded-md" />
                  </div>
                </div>

                <div>
                  <div style={{ display: isImageModalOpen ? 'none' : 'block' }}>
                    <Skeleton className="h-6 w-1/4 mb-4" />{' '}
                    <Skeleton className="h-[300px] sm:h-[400px] w-full rounded-md" />{' '}
                  </div>
                  <Skeleton className="h-4 w-1/2 mt-2" />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </>
    );
  }

  return (
    <>
      <DashboardNav />
      <div className="container max-w-7xl mx-auto px-4 py-8 min-h-screen">
        <div className="hidden sm:flex justify-start max-w-5xl pl-28 mb-4 ">
          <button
            onClick={handleGoBack}
            className="flex items-center hover:underline cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </button>
        </div>

        <div className="flex justify-center">
          <Card className="container mb-8 max-w-5xl bg-gray-50">
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

              <div className="flex justify-end gap-5 items-center">
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

                {user?.role === 'authority' && (
                  <Button className="flex gap-2 cursor-pointer bg-blue-700 text-lightBlue hover:bg-blue-800">
                    <SquarePen />
                    Update Issue
                  </Button>
                )}
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
