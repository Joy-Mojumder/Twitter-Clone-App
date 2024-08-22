import { useState } from "react";
import { useParams } from "react-router-dom";
import Posts from "../../components/common/Posts";

const SharePostPage = () => {
  const [feedType] = useState("shared");

  const { userId } = useParams();

  return (
    <div className="flex-[4_4_0] border-l border-r border-gray-700 min-h-screen">
      <Posts feedType={feedType} userId={userId} />
    </div>
  );
};

export default SharePostPage;
