import React, { useState, useEffect } from 'react';

export default function withLoader(Element, url) {
  return (props) => {
    const [data, setData] = useState(null);

    const fetchData = async () => {
      try {
        const res = await fetch(url);
        const data = await res.json();
        setData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    useEffect(() => {
      fetchData();
    }, []);

    if (!data) {
      return <div>Loading...</div>;
    }

    return <Element {...props} reloadData={fetchData} data={data} />;
  };
}
