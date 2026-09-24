import { ExternalLink, Newspaper } from "lucide-react";
import { useEffect, useState } from "react";

type Notification = {
  id: string;
  exam_id: string;
  title: string;
  summary: string;
  notification_type: string;
  official_url: string;
  document_url: string | null;
  published_at: string | null;
  detected_at: string;
  is_new: boolean;
  is_verified: boolean;
};

export function LatestNotifications() {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    let active = true;
    fetch("/api/notifications?limit=6")
      .then((response) => (response.ok ? response.json() : { notifications: [] }))
      .then((data: { notifications?: Notification[] }) => {
        if (active && Array.isArray(data.notifications)) setNotifications(data.notifications);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  if (notifications.length === 0) return null;

  return (
    <section aria-labelledby="latest-notifications-heading" className="mt-10">
      <div className="mb-4 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-[#9fc0ff]">
            Official source watch
          </p>
          <h2 id="latest-notifications-heading" className="mt-1 text-xl font-semibold text-white">
            Latest notifications
          </h2>
        </div>
        <Newspaper className="size-5 text-[#6fa0ff]" aria-hidden="true" />
      </div>
      <div className="grid gap-3 md:grid-cols-2">
        {notifications.map((notification) => (
          <article key={notification.id} className="border border-white/10 bg-[#102b4d] p-4">
            <div className="flex flex-wrap items-center gap-2 text-[10px] font-bold uppercase tracking-[0.14em] text-[#aebed3]">
              {notification.is_new && (
                <span className="bg-[#2d64eb] px-2 py-1 text-white">New</span>
              )}
              <span>{notification.notification_type.replaceAll("_", " ")}</span>
              {notification.is_verified && <span className="text-[#58d68d]">Verified</span>}
            </div>
            <h3 className="mt-3 font-semibold text-white">{notification.title}</h3>
            <p className="mt-1 line-clamp-2 text-sm leading-6 text-[#c5d1e1]">
              {notification.summary}
            </p>
            <a
              href={notification.document_url ?? notification.official_url}
              target="_blank"
              rel="noreferrer noopener"
              className="mt-3 inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-[0.12em] text-[#9fc0ff] hover:text-white"
            >
              Official source <ExternalLink className="size-3.5" aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}
