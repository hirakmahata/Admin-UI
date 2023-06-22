function Edit({ item, tableData, setTableData }) {
  const handleInput = (e) => {
    const newTableData = tableData.map((user) =>
      user.id === item.id ? { ...user, [e.target.name]: e.target.value } : user
    );
    setTableData(newTableData);
  };

  return (
    <tr key={item.id}>
      <th scope="row">
        <input
          className="form-check-input hoverPointer border border-dark mx-4 mt-2"
          type="checkbox"
          value=""
          id="flexCheckDefault"
        />
      </th>
      <td>
        <input
          type="text"
          className="form-control bg-secondary text-light"
          onChange={handleInput}
          value={item.name}
          name="name"
        />
      </td>
      <td>
        <input
          type="text"
          className="form-control bg-secondary text-light"
          onChange={handleInput}
          value={item.email}
          name="email"
        />
      </td>
      <td>
        <input
          type="text"
          className="form-control bg-secondary text-light"
          onChange={handleInput}
          value={item.role}
          name="role"
        />
      </td>
      <td>
        <button type="submit" className="btn btn-secondary">
          Update
        </button>
      </td>
    </tr>
  );
}

export default Edit;
