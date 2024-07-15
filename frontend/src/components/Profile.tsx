export interface ProfileProps {
    id: string;
    name: string;
    bio: string;
  }
  
  const Profile: React.FC<ProfileProps> = ({ id, name, bio }) => {
    return (
      <div>
        <h1>Profile: {name}</h1>
        <p>ID: {id}</p>
        <p>Bio: {bio}</p>
      </div>
    );
  };
  
  export default Profile;
  