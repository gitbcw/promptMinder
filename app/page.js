'use client';
import PromptsPage from './prompts/page';
import RequireLogin from '../components/RequireLogin';

export default function Home() {
  return (
    <>
      <RequireLogin />
      <PromptsPage />
    </>
  );
}
