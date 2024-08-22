import { useState } from "react";
import Posts from "../../components/common/Posts";
import { useParams } from "react-router-dom";

const SavedPostPage = () => {
  const [feedType] = useState("saved");

  const { userId } = useParams();
  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
      <Posts feedType={feedType} userId={userId} />
    </div>
  );
};

export default SavedPostPage;
