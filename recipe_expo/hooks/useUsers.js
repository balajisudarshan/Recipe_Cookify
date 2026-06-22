import { useEffect, useState } from "react";
import { getUsers } from "../api/apiRoute";

const useUsers = ({limit,sortBy}={}) => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchUsers = async () => {
    try {
      setLoading(true);

      const response = await getUsers({
        limit,
        sortBy
      });

      setUsers(response.data.users);
    } catch (err) {
      setError(err);
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return {
    users,
    loading,
    error,
    refetch: fetchUsers,
  };
};

export default useUsers;