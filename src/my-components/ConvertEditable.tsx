import { useEffect, useState } from 'react';
import { calculateRows } from '../common/utils';

type ConvertEditablePropsType = {
  onSave: (value: string) => void;
  element: React.ReactNode;
  data: string;
};

export const ConvertEditable = ({
  element,
  onSave,
  data,
}: ConvertEditablePropsType) => {
  const [isEditable, setEditable] = useState(false);
  const [value, setValue] = useState<string>('');

  useEffect(() => {
    if (data) setValue(data);
  }, [data]);

  return (
    <>
      {!isEditable ? (
        <div
          onClick={() => setEditable(true)}
          className={`scrollbar overflow-y-auto h-fit max-h-80`}
        >
          {element}
        </div>
      ) : (
        <div>
          <textarea
            value={value}
            onChange={(e) => {
              setValue(e?.target?.value);
            }}
            rows={calculateRows(value)}
            className="font-sans scrollbar h-fit bg-transparent p-2 border border-slate-500 rounded-md text-slate-600 w-full text-pretty dark:text-slate-400 text-xs md:text-base break-words whitespace-break-spaces overflow-auto"
          />
          <div className="flex gap-2 justify-end">
            <button
              className="px-3 py-0.5 bg-blue-500 text-white rounded hover:bg-blue-600"
              onClick={() => {
                onSave(value);
                setEditable(false);
              }}
            >
              Save
            </button>
            <button
              onClick={() => setEditable(false)}
              className="px-2 py-0.5 border border-slate-700 text-white rounded bg-slate-700 hover:bg-slate-600"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </>
  );
};
