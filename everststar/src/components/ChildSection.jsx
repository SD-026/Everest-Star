export default function ChildSection({ index, child, handleChildChange, removeChild }) {
    return (
      <div className="border p-2 mb-2">
        <h4 className="font-bold">Child {index + 1}</h4>
        <input type="text" value={child.name} onChange={(e) => handleChildChange(index, 'name', e.target.value)} className="input" placeholder="Full Name" />
        <input type="text" value={child.dob} onChange={(e) => handleChildChange(index, 'dob', e.target.value)} className="input" placeholder="DOB (DD/MMM/YYYY)" />
        <select value={child.gender} onChange={(e) => handleChildChange(index, 'gender', e.target.value)} className="input">
          <option value="">Select Gender</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
        </select>
        <select value={child.relation} onChange={(e) => handleChildChange(index, 'relation', e.target.value)} className="input">
          <option value="">Select Relation</option>
          <option value="Son">Son</option>
          <option value="Daughter">Daughter</option>
        </select>
        <input type="text" value={child.cnic} onChange={(e) => handleChildChange(index, 'cnic', e.target.value)} className="input" placeholder="Child CNIC/BForm/FRC #" />
        <button onClick={() => removeChild(index)} className="text-red-600">Remove</button>
      </div>
    );
  }
  