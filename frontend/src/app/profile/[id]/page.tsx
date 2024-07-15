import React from "react";

const ProfileDetails = ({ params }: { params: { id: string } }) => {
  const { id } = params;
  return (
    <div className="bg-slate-500 w-96 text-center my-20 p-10 mx-20">
      <h1>
        The profile id is <b>{id}</b>   
      </h1>
    </div>
  );
};

export default ProfileDetails;