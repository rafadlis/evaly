import { Link } from "@/i18n/navigation";
import { $api } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { motion } from "motion/react";
const SectionRecent = () => {
  const { data: messages, isPending: isLoadingMessages } = useQuery({
    queryKey: ["llm-messages"],
    queryFn: async () => {
      const res = await $api.organization.question.llm.chat.get();
      return res.data;
    },
  });

  if (isLoadingMessages || !messages) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="flex flex-col my-28"
    >
      <h1 className="font-medium">Recent</h1>
      <p className="text-muted-foreground text-sm">
        Here are some of your recent question sets.
      </p>
      <div className="grid grid-cols-3 gap-4 mt-6">
        {messages?.map((message) => (
          <Link
            key={message.id}
            href={`/dashboard/question/generate/${message.id}`}
            className="p-4 border"
          >
            <h3 className="font-medium line-clamp-1 text-sm">
              {message.title || "Untitled Question Set"}
            </h3>
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <span>
                {new Date(message.updatedAt).toLocaleDateString(undefined, {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
            </div>
          </Link>
        ))}
      </div>
    </motion.div>
  );
};

export default SectionRecent;
