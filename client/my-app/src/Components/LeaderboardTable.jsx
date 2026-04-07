import React from 'react';

const LeaderboardTable = ({ leaderboard }) => {
  if (!leaderboard || leaderboard.length === 0) {
    return <div style={{textAlign: 'center', color: '#94a3b8'}}>No data available.</div>;
  }

  return (
    <table className="leaderboard-table">
      <thead>
        <tr>
          <th className="rank-col">Rank</th>
          <th>Username</th>
          <th className="score-col">Score</th>
          <th>Challenges Solved</th>
        </tr>
      </thead>
      <tbody>
        {leaderboard.map((user) => (
          <tr key={user.username}>
            <td className={`rank-col rank-${user.rank}`}>#{user.rank}</td>
            <td>{user.username}</td>
            <td className="score-col">{user.score}</td>
            <td>{user.solved_count}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default LeaderboardTable;
