export const ReviewStep = ({ onPrev }) => {
  const summaryData = [
    { label: 'Plan:', value: 'Free Plan (You can upgrade after login)', color: 'text-green-500 font-semibold' },
    { label: 'Account Type:', value: 'Real Estate Company' },
    { label: 'Name:', value: 'adfasf asdfasdf' },
    { label: 'Email:', value: 'sdf@gmail.com' },
    { label: 'Phone:', value: '+92 3007722213' },
    { label: 'Company Name:', value: 'colect' },
    { label: 'Industry:', value: 'Real Estate' },
    { label: 'Company Size:', value: '11-50' },
  ];

  return (
    <div>
      <div className="text-center mb-8">
        <h2 className="text-xl font-bold text-gray-800">Review & Complete</h2>
        <p className="text-sm text-gray-500">Almost done! Please review your information and complete your REM CRM registration</p>
      </div>

      <div className="bg-gray-50 rounded-xl p-6 mb-6">
        <h3 className="font-bold text-gray-800 mb-4 border-b pb-2 border-gray-200">Account Summary</h3>
        <div className="space-y-3">
          {summaryData.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <span className="text-gray-500">{item.label}</span>
              <span className={`text-right ${item.color || 'text-gray-800 font-medium'}`}>{item.value}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4 mb-8">
        <label className="flex items-start cursor-pointer group">
          <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded border-gray-300" />
          <span className="text-xs text-gray-600">
            I agree to the <a href="#" className="text-blue-600 underline">Terms of Service</a> and <a href="#" className="text-blue-600 underline">Privacy Policy</a>
          </span>
        </label>
        <label className="flex items-start cursor-pointer group">
          <input type="checkbox" className="mt-1 mr-3 h-4 w-4 rounded border-gray-300" />
          <span className="text-xs text-gray-600">
            I would like to receive updates and marketing communications about REM CRM
          </span>
        </label>
      </div>

      <div className="flex justify-between items-center border-t pt-6">
        <button onClick={onPrev} className="text-gray-500 font-medium">← Previous</button>
        <button className="bg-blue-600 text-white px-8 py-2 rounded-lg font-bold flex items-center shadow-md">
           ✓ Create Account
        </button>
      </div>
    </div>
  );
};