import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/figma/Button';

export default function NarrativeScreen() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-[var(--s3-canvas-dark)] via-[var(--s3-canvas-dark)] to-[var(--s3-canvas-dark)] flex items-center justify-center px-6">
      <div className="max-w-2xl w-full text-center space-y-6">
        <h1 className="text-4xl font-bold bg-gradient-to-r from-[var(--s3-lavender-200)] to-[var(--s3-lavender-400)] bg-clip-text text-transparent">
          Narrative Generation
        </h1>
        
        <div className="p-8 bg-[var(--s3-surface-default)]/50 border border-[var(--s3-border-default)] rounded-[var(--s3-radius-xl)]">
          <p className="text-lg text-[var(--s3-text-default)] mb-6">
            Narrative generation feature coming soon!
          </p>
          
          <p className="text-sm text-[var(--s3-text-subtle)] mb-8">
            This feature will generate a personalized narrative based on your star system classification, 
            weaving together your Human Design attributes and cosmic alignment into a compelling story.
          </p>
          
          <div className="flex gap-4 justify-center">
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate('/dossier')}
            >
              Back to Dossier
            </Button>
            
            <Button
              variant="secondary"
              size="md"
              onClick={() => navigate('/result')}
            >
              Back to Results
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
