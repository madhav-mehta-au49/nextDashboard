// Navigation helpers for candidate module
import { useRouter } from 'next/navigation';

export function useCandidateNavigation() {
  const router = useRouter();

  return {
    goToDashboard: () => router.push('/user/candidate'),
    goToProfile: (candidateSlug: string) => router.push(`/user/candidate/${candidateSlug}`),
    goToEditProfile: (candidateSlug: string) => router.push(`/user/candidate/${candidateSlug}/edit`),
    goToCreate: () => router.push('/user/candidate/create'),
    goToExperience: (candidateSlug: string) => router.push(`/user/candidate/${candidateSlug}/experience`),
    goToEducation: (candidateSlug: string) => router.push(`/user/candidate/${candidateSlug}/education`),
    goToCertification: (candidateSlug: string) => router.push(`/user/candidate/${candidateSlug}/certification`),
    goToJobs: (candidateSlug: string) => router.push(`/user/candidate/jobs/${candidateSlug}`),
    goToSavedJobs: (candidateSlug: string) => router.push(`/user/candidate/jobs/${candidateSlug}/saved`),
    goToApplications: (candidateSlug: string) => router.push(`/user/candidate/jobs/${candidateSlug}/applications`),
  };
}
