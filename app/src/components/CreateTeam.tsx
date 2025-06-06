import { useState } from "react";
import { fetcher } from "../utils/fetcher";
import "./CreateTeam.css";

export const CreateTeam = ({ onClose }: { onClose: () => void }) => {
  const [teamName, setTeamName] = useState("");

  const handleCreate = async () => {
    try {
      await fetcher("/team/create", {
        method: "POST",
        body: { name: teamName },
      });
      onClose();
    } catch (err) {
      console.error("Failed to create team", err);
    }
  };

  return (
    <div className="modal">
      <h2>Create a New Team</h2>
      <label htmlFor="team-name">Team Name</label>
      <input
        id="team-name"
        type="text"
        value={teamName}
        onChange={(e) => setTeamName(e.target.value)}
      />
      <button onClick={handleCreate}>Create Team</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
};
