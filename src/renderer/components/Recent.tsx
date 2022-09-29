import { useEffect, useState } from 'react';

const RecentList = () => {
  const defaultValue = ['No Recent Connections'];
  const [recent, setRecent] = useState<string[]>(defaultValue);

  useEffect(() => {
    const fetchRecent = async () => {
      const newRecent = await window.procedures.ipcRenderer.fetchDatabases();
      setRecent(newRecent);
    };
    fetchRecent();
  }, []);

  return (
    <div className="recent-list">
      {recent.map((connection) => (
        <div className="recent-item">{connection}</div>
      ))}
    </div>
  );
};

export default RecentList;
