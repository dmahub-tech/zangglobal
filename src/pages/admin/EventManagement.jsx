// EventManagement.js
import React, { useState, useEffect } from "react";
import api from "../../config/api";

function EventManagement() {
  const [attendants, setAttendants] = useState([]);
  const [editingAttendant, setEditingAttendant] = useState(null);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    organization: "",
    position: "",
    residence: "",
    category: "",
    attendance: "",
    source: "",
    updates: false,
  });

  useEffect(() => {
    fetchAttendants();
  }, []);

  const fetchAttendants = async () => {
    try {
      const response = await api.get("/attendance");
      const data = response.data
      console.log(data)
      setAttendants(data);
    } catch (error) {
      console.error("Error fetching attendants:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this attendant?")) {
      try {
        const response = await fetch(`/api/attendants/${id}`, {
          method: "DELETE",
        });

        if (response.ok) {
          fetchAttendants();
        } else {
          alert("Failed to delete attendant");
        }
      } catch (error) {
        console.error("Error deleting attendant:", error);
      }
    }
  };

  const handleEdit = (attendant) => {
    setEditingAttendant(attendant._id);
    setFormData({
      fullName: attendant.fullName,
      email: attendant.email,
      phone: attendant.phone,
      organization: attendant.organization,
      position: attendant.position,
      residence: attendant.residence,
      category: attendant.category,
      attendance: attendant.attendance,
      source: attendant.source,
      updates: attendant.updates,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`/api/attendants/${editingAttendant}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        setEditingAttendant(null);
        fetchAttendants();
      } else {
        alert("Failed to update attendant");
      }
    } catch (error) {
      console.error("Error updating attendant:", error);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const cancelEdit = () => {
    setEditingAttendant(null);
  };

  return (
    <div className="min-h-screen bg-background text-white p-4">
      <div className="container mx-auto">
        <h1 className="text-3xl font-bold text-center text-primary mb-8">
          Admin Dashboard
        </h1>

        <div className="bg-mutedSecondary rounded-lg shadow-lg p-6">
          <h2 className="text-2xl font-semibold text-primary mb-4">
            Registered Attendants
          </h2>

          {attendants.length === 0 ? (
            <p className="text-primary">No attendants registered yet.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white text-gray-800 rounded-lg">
                <thead>
                  <tr className="bg-primary text-white">
                    <th className="py-2 px-4 text-left">Name</th>
                    <th className="py-2 px-4 text-left">Email</th>
                    <th className="py-2 px-4 text-left">Phone</th>
                    <th className="py-2 px-4 text-left">Category</th>
                    <th className="py-2 px-4 text-left">Attendance</th>
                    <th className="py-2 px-4 text-left">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {attendants.map((attendant) => (
                    <tr key={attendant._id} className="border-b">
                      <td className="py-2 px-4">{attendant.fullName}</td>
                      <td className="py-2 px-4">{attendant.email}</td>
                      <td className="py-2 px-4">{attendant.phone}</td>
                      <td className="py-2 px-4">{attendant.category}</td>
                      <td className="py-2 px-4">{attendant.attendance}</td>
                      <td className="py-2 px-4">
                        <button
                          onClick={() => handleEdit(attendant)}
                          className="bg-accent text-white px-2 py-1 rounded mr-2"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(attendant._id)}
                          className="bg-red-600 text-white px-2 py-1 rounded"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {editingAttendant && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-mutedSecondary rounded-lg shadow-lg p-6 w-full max-w-md">
              <h2 className="text-2xl font-semibold text-primary mb-4">
                Edit Attendant
              </h2>
              <form onSubmit={handleUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-primary">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary">
                    Email *
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 text-gray-800"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-primary">
                    Phone *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring focus:ring-primary focus:ring-opacity-50 p-2 text-gray-800"
                  />
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    type="button"
                    onClick={cancelEdit}
                    className="px-4 py-2 bg-neutralGray text-gray-800 rounded"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-primary text-white rounded"
                  >
                    Update
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default EventManagement;
