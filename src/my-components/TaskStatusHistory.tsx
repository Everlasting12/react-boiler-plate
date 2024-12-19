import { ArrowRightCircle, MessageCircle } from 'lucide-react';
import dayjs from 'dayjs';
import { TaskStatus, TaskStatusColors, getStatusColor } from '../common/enums';

interface HistoryEvent {
  id: number;
  eventType: string;
  details: {
    from: string;
    to?: string;
    text?: string;
  };
  createdAt: string;
}

interface TaskStatusHistoryProps {
  history: HistoryEvent[];
}

export default function TaskStatusHistory({ history }: TaskStatusHistoryProps) {
  const sortedHistory = [...history].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  return (
    <div className="w-full py-5">
      <div className="relative">
        {sortedHistory.map((event, index) => (
          <div key={event.id} className="mb-8 flex">
            <div className="flex flex-col items-center mr-4">
              <div
                className={`rounded-full p-1 flex items-center justify-center ${getEventIcon(
                  event,
                )?.bg} text-white`}
              >
                {getEventIcon(event)?.icon}
              </div>
              {index < sortedHistory.length - 1 && (
                <div className="h-full w-0.5 bg-gray-300 mt-2"></div>
              )}
            </div>

            <div className="bg-white dark:bg-slate-400/10 p-2 rounded-lg shadow-md flex-grow">
              {getEventComponent(event)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function getEventComponent(event: HistoryEvent) {
  switch (event.eventType) {
    case 'STATUS_CHANGE':
      return <StatusChangeEvent event={event} />;
    case 'COMMENT':
      return <CommentEvent event={event} />;
    default:
      return null;
  }
}
function getEventIcon(event: HistoryEvent) {
  switch (event.eventType) {
    case 'STATUS_CHANGE':
      return {
        bg: 'bg-blue-500',
        icon: <ArrowRightCircle className="w-4 h-4" />,
      };
    case 'COMMENT':
      return {
        bg: 'bg-green-500',
        icon: <MessageCircle className="w-4 h-4" />,
      };
    default:
      return null;
  }
}

function StatusChangeEvent({ event }: { event: HistoryEvent }) {
  const fromStatus = TaskStatus[event.details.from as keyof typeof TaskStatus];
  const toStatus = TaskStatus[event.details.to as keyof typeof TaskStatus];

  return (
    <div className="font-sans">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold mb-1">Status Changed</p>
        <p className="text-xs text-gray-500">
          {dayjs(event.createdAt).format('DD MMM YYYY')} at{' '}
          {dayjs(event.createdAt).format('hh:MM a')}
        </p>
      </div>
      <div className="flex items-center space-x-2">
        <span
          className={`px-2 py-0.5 rounded text-white text-sm ${
            TaskStatusColors[event.details.from as keyof typeof TaskStatus].bg
          }`}
        >
          {fromStatus}
          {/* ${getStatusColor(fromStatus)}  */}
        </span>
        <ArrowRightCircle className="w-4 h-4 text-gray-500" />
        <span
          className={`px-2 py-0.5 rounded text-white text-sm ${
            TaskStatusColors[event.details.to as keyof typeof TaskStatus].bg
          }`}
        >
          {toStatus}
        </span>
      </div>
    </div>
  );
}

function CommentEvent({ event }: { event: HistoryEvent }) {
  return (
    <div className="font-sans">
      <div className="flex items-center justify-between">
        <p className="text-xs font-bold mb-1">{event.details.from}</p>
        <p className="text-xs text-gray-500">
          {dayjs(event.createdAt).format('DD MMM YYYY')} at{' '}
          {dayjs(event.createdAt).format('hh:MM a')}
        </p>
      </div>

      <p className="text-sm bg-gray-100 rounded bg-slate-200/30 dark:bg-slate-500/30 p-2">
        {event.details.text}
      </p>
    </div>
  );
}
