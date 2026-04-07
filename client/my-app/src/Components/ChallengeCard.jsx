import React from 'react';
import '../styles/challenge.css';
import FlagSubmit from './FlagSubmit';
import FileDownload from './FileDownload';

const ChallengeCard = ({ challenge, onFlagSubmit }) => {
  if (!challenge) {
    return <div className="no-challenge">No active challenge for this week. Check back later!</div>;
  }

  return (
    <div className="challenge-card">
      <div className="challenge-header">
        <h3 className="challenge-title">
          {challenge.title}
        </h3>
        <span className="challenge-points">{challenge.points} pts</span>
      </div>
      
      <div className="challenge-desc">
        {challenge.description.split('\n').map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>

      {challenge.file_url && (
        <FileDownload challengeId={challenge.id} />
      )}

      <FlagSubmit challengeId={challenge.id} onResult={onFlagSubmit} />
    </div>
  );
};

export default ChallengeCard;
