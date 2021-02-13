import { parseCookies } from "nookies";
import { useEffect, useState } from "react";
import baseUrl from "../helpers/baseUrl";

export default function UserRoles() {
  const { token } = parseCookies();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    const res = await fetch(`${baseUrl}/api/users`, {
      method: "GET",
      "Content-Type": "application/json",
      headers: { Authorization: token },
    });
    const res2 = await res.json();
    setUsers(res2);
  };

  const handleRole = async (_id, role) => {
    const res = await fetch(`${baseUrl}/api/users`, {
      method: "PUT",
      headers: { "Content-Type": "application/json", Authorization: token },
      body: JSON.stringify({ _id, role }),
    });
    const res2 = await res.json();
    fetchUser();
  };

  return (
    <>
      <h1>User roles</h1>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Item Name</th>
            <th>Item Price</th>
          </tr>
        </thead>
        <tbody>
          {users.map((item, index) => (
            <tr key={index}>
              <td>{item.name}</td>
              <td>{item.email}</td>
              <td>
                <label
                  onClick={() => {
                    handleRole(item._id, item.role);
                  }}
                >
                  <input
                    type="checkbox"
                    defaultChecked
                    checked={item.role === "admin" ? "checked" : ""}
                  />
                  <span>{item.role}</span>
                </label>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
