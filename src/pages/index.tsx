import React, { useEffect, useState, useReducer } from 'react';
import ReactDOM from 'react-dom';

export default function Home() {
  type Event = {
    name: string;
    value: string | number | Date | boolean;
    type: string;
  };

  type Entry = {
    guestName: string;
    numberOfNights: number;
    checkinDate: Date;
    checkoutDate: Date;
    status: string;
    payout: number;
    sevenPercentAlreadyPaid?: boolean;
    fivePercentTaxAmount?: number;
    sevenPercentTaxAmount?: number;
    baseRate?: number;
  };

  const [data, setData] = useState<Entry[]>([
    {
      guestName: 'Bob Saget',
      numberOfNights: 10,
      checkinDate: new Date(2023, 3, 5),
      checkoutDate: new Date(2023, 3, 15),
      status: 'Booked',
      payout: 2321.42,
    },
    {
      guestName: 'Tom Riddle',
      numberOfNights: 3,
      checkinDate: new Date(2023, 3, 15),
      checkoutDate: new Date(2023, 3, 18),
      status: 'Booked',
      payout: 532.22,
    },
    {
      guestName: 'Collin F.',
      numberOfNights: 6,
      checkinDate: new Date(2023, 4, 5),
      checkoutDate: new Date(2023, 4, 11),
      status: 'Booked',
      payout: 1000,
    },
  ]);
  const [cancelFormSubmission, setCancelFormSubmission] = useState<boolean>();

  const formReducer = (state: Partial<Entry>, event: Event) => {
    switch (event.type) {
      case 'reset':
        return {};
      case 'update':
        return {
          ...state,
          [event.name]: event.value,
        };
      default:
        return state;
    }
  };

  const [editableData, setEditableData] = useReducer(formReducer, {
    guestName: '',
    numberOfNights: 0,
    checkinDate: new Date(),
    checkoutDate: new Date(),
    status: '',
    payout: 0,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const isCheckbox = e.target.type === 'checkbox';

    setEditableData({
      name: e.target.name,
      value: isCheckbox ? e.target.checked : e.target.value,
      type: 'update',
    });
  };

  const submitEditableData = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!cancelFormSubmission) {
      const formData = Object.fromEntries(new FormData(e.currentTarget));
      const updatedData = data.map((item: Entry) => {
        if (new Date(item.checkinDate).getTime() == new Date(formData.checkinDate as string).getTime()) {
          item.fivePercentTaxAmount = Number(formData.fivePercentTaxAmount);
          item.sevenPercentTaxAmount = Number(formData.sevenPercentTaxAmount);
          item.baseRate = Number(formData.baseRate);
          item.sevenPercentAlreadyPaid = Boolean(formData.sevenPercentAlreadyPaid);
        }
        return item;
      });
      setData(updatedData);
    }
    setEditableData({ type: 'reset', name: '', value: '' });
  };

  function renderItem(item: Entry, index: number): React.ReactElement {
    return (
      <tr key={index} style={{ backgroundColor: item.sevenPercentAlreadyPaid ? 'green' : '' }}>
        <td>{item.guestName}</td>
        <td>
          {item.checkinDate instanceof Date
            ? item.checkinDate.toLocaleDateString()
            : new Date(item.checkinDate).toLocaleDateString()}
        </td>
        <td>
          {item.checkoutDate instanceof Date
            ? item.checkoutDate.toLocaleDateString()
            : new Date(item.checkoutDate).toLocaleDateString()}
        </td>
        <td>{item.status}</td>
        <td>${item.payout}</td>
        <td>${item.fivePercentTaxAmount}</td>
        <td>${item.sevenPercentTaxAmount}</td>
        <td>${item.baseRate}</td>
        <td>
          <button
            onClick={() => {
              window.scrollTo(0, 0);
              setEditableData({ type: 'reset', name: '', value: '' });
              Object.entries(item).forEach(([key, value]) =>
                setEditableData({ name: key, value: value, type: 'update' })
              );
            }}
          >
            Edit
          </button>
        </td>
      </tr>
    );
  }

  return (
    <>
      {editableData?.guestName && editableData?.guestName?.length > 0 && (
        <form
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            margin: '1rem 0',
            alignItems: 'start',
          }}
          onSubmit={submitEditableData}
        >
          <div>
            <input type="hidden" name="checkinDate" value={editableData.checkinDate?.toString()} />
          </div>
          <div>
            <label>5% Tax</label>
            <input
              type="number"
              name="fivePercentTaxAmount"
              value={editableData.fivePercentTaxAmount || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>7% Tax</label>
            <input
              type="number"
              name="sevenPercentTaxAmount"
              value={editableData.sevenPercentTaxAmount || ''}
              onChange={handleChange}
            />
          </div>
          <div>
            <label>Base Rate</label>
            <input type="number" name="baseRate" value={editableData.baseRate || ''} onChange={handleChange} />
          </div>
          <div>
            <label>Seven % Paid?</label>
            <input
              type="checkbox"
              name="sevenPercentAlreadyPaid"
              checked={editableData.sevenPercentAlreadyPaid || false}
              onChange={handleChange}
            />
          </div>
          <div style={{ flexDirection: 'row' }}>
            <button onClick={() => setCancelFormSubmission(false)} style={{ marginRight: '1rem' }} type="submit">
              Submit
            </button>
            <button onClick={() => setCancelFormSubmission(true)}>Cancel</button>
          </div>
        </form>
      )}
      <h2>Customer Data</h2>
      <table>
        <thead>
          <tr>
            <th>Guest Name</th>
            <th>Checkin</th>
            <th>Checkout</th>
            <th>Status</th>
            <th>Payout</th>
            <th>5% Tax</th>
            <th>7% Tax</th>
            <th>Base Rate</th>
            <th></th>
          </tr>
        </thead>
        <tbody>{data.map((item, index) => renderItem(item, index))}</tbody>
      </table>
    </>
  );
}
