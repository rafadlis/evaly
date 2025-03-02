import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  BrainCircuit,
  ChevronLeft,
  Layers,
  PenTool,
  Search,
  Sparkles,
  Zap,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useState } from "react";

const DialogAddQuestion = ({
  referenceId,
  onClose,
  order,
}: {
  order?: number;
  referenceId?: string;
  refetch?: () => void;
  onClose?: () => void;
}) => {
  const [open, setOpen] = useState(false);
  const [selectedMethod, setSelectedMethod] = useState<
    "import" | "generate" | "create"
  >();

  useEffect(() => {
    if (order !== undefined) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [order]);

  const closeDialog = () => {
    setOpen(false);
    onClose?.();
  };

  const onBack = () => {
    if (selectedMethod === undefined) {
      closeDialog();
    } else {
      setSelectedMethod(undefined);
    }
  };

  if (!referenceId) return null;

  return (
    <Drawer
      open={open}
      onOpenChange={(open)=>{
        setOpen(open)
        onClose?.()
      }}
      handleOnly
    >
      <DrawerContent className="h-dvh">
        <DrawerTitle className="hidden"></DrawerTitle>
        <DrawerHeader className="hidden"></DrawerHeader>
        {/* Header */}
        <header className="px-6 py-4 border-b border-border">
          <div className="mx-auto flex items-center">
            <button
              onClick={onBack}
              className="p-2 rounded-full hover:bg-muted transition-all duration-200 cursor-pointer"
            >
              <ChevronLeft className="text-muted-foreground" size={20} />
            </button>
            <h1 className="ml-3 text-lg font-medium text-foreground">
              Add new question
            </h1>
          </div>
        </header>

        <AnimatePresence>
          {selectedMethod === undefined ? (
            <motion.div
              initial={{ opacity: 0, }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)", x: -100 }}
              transition={{ duration: 0.2 }}
              className="flex-1"
            >
              <SectionSelectMethod setSelectedMethod={setSelectedMethod} />
            </motion.div>
          ) : null}
        </AnimatePresence>
      </DrawerContent>
    </Drawer>
  );
};

const SectionSelectMethod = ({
  setSelectedMethod,
}: {
  setSelectedMethod: (method: "import" | "generate" | "create") => void;
}) => {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);

  return (
    <div className="h-full bg-background text-foreground flex flex-col overflow-y-auto">
      {/* Main Content */}
      <main className="flex-1 flex items-center justify-center px-4">
        <div className="w-full container max-w-6xl">
          <div className="text-center mb-10 relative">
            <h2 className="text-5xl font-bold text-foreground mb-2">
              Create your question
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Choose how you want to add a new question to your activity
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Import worksheets/questions card */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredCard(0)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-b from-emerald-500/20 to-transparent rounded-3xl transition-opacity duration-300 ${
                  hoveredCard === 0 ? "opacity-100" : "opacity-0"
                }`}
              ></div>
              <div className="relative z-10 border border-border rounded-3xl overflow-hidden h-full transition-all duration-300 hover:border-emerald-500/50 group">
                <div className="absolute top-0 left-0 w-full h-1 bg-emerald-500 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></div>

                <div className="p-8 flex flex-col h-full">
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 flex items-center justify-center mb-4">
                      <Layers className="text-emerald-400" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Import questions
                    </h3>
                    <p className="text-muted-foreground">
                      Upload files with questions from documents or spreadsheets
                    </p>
                  </div>

                  <div className="flex-grow flex items-center justify-center">
                    <div className="relative">
                      <div className="absolute -top-4 -left-4 w-20 h-28 bg-card rounded-lg border border-border transform rotate-[-12deg] transition-all duration-200 group-hover:rotate-[-8deg] group-hover:-translate-y-1">
                        <div className="h-3 w-12 bg-emerald-500/30 rounded-sm m-2 mb-4"></div>
                        <div className="h-2 w-14 bg-muted rounded-sm mx-2 mb-2"></div>
                        <div className="h-2 w-10 bg-muted rounded-sm mx-2 mb-2"></div>
                        <div className="h-2 w-12 bg-muted rounded-sm mx-2"></div>
                      </div>

                      <div className="absolute -top-2 left-2 w-20 h-28 bg-card rounded-lg border border-border transform rotate-[-4deg] transition-all duration-200 group-hover:rotate-[2deg] z-10">
                        <div className="grid grid-cols-4 gap-1 p-2">
                          {[...Array(12)].map((_, i) => (
                            <div
                              key={i}
                              className="h-2 w-full bg-emerald-500/20 rounded-sm"
                            ></div>
                          ))}
                        </div>
                      </div>

                      <div className="relative w-20 h-28 bg-card rounded-lg border border-border transform rotate-[6deg] transition-all duration-200 group-hover:rotate-[10deg] group-hover:translate-y-1 left-8">
                        <div className="h-3 w-12 bg-emerald-500/30 rounded-sm m-2 mb-3"></div>
                        <div className="h-10 w-14 bg-muted/50 rounded-sm mx-2 mb-2"></div>
                        <div className="h-2 w-10 bg-muted rounded-sm mx-2 mb-2"></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => setSelectedMethod("import")}
                      type="button"
                      className="w-full py-3 rounded-xl bg-card hover:bg-emerald-500/20 border border-foreground/10 hover:border-emerald-500/50 transition-all duration-200 text-muted-foreground hover:text-emerald-400 font-medium cursor-pointer"
                    >
                      Import questions
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Generate with AI card */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-b from-purple-500/20 to-transparent rounded-3xl transition-opacity duration-300 ${
                  hoveredCard === 1 ? "opacity-100" : "opacity-0"
                }`}
              ></div>
              <div className="relative z-10 border border-border rounded-3xl overflow-hidden h-full transition-all duration-300 hover:border-purple-500/50 group">
                <div className="absolute top-0 left-0 w-full h-1 bg-purple-500 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></div>

                <div className="p-8 flex flex-col h-full">
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-purple-500/10 flex items-center justify-center mb-4">
                      <BrainCircuit className="text-purple-400" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Generate with AI
                    </h3>
                    <p className="text-muted-foreground">
                      Create questions automatically from your content or topics
                    </p>
                  </div>

                  <div className="flex-grow flex items-center justify-center">
                    <div className="relative w-40 h-32">
                      <div className="absolute inset-0 bg-card rounded-lg border border-border overflow-hidden">
                        <div className="h-1 w-full bg-purple-500/30"></div>
                        <div className="p-3">
                          <div className="flex items-center space-x-2 mb-4">
                            <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                              <Zap className="text-purple-400" size={14} />
                            </div>
                            <div className="h-2 w-20 bg-muted rounded-sm"></div>
                          </div>

                          <div className="space-y-2">
                            <div className="h-2 w-full bg-muted rounded-sm"></div>
                            <div className="h-2 w-3/4 bg-muted rounded-sm"></div>
                            <div className="h-2 w-5/6 bg-muted rounded-sm"></div>
                            <div className="h-2 w-2/3 bg-muted rounded-sm"></div>
                          </div>

                          <div className="mt-4 flex space-x-2">
                            <div className="h-6 w-6 rounded-md bg-purple-500/20 flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-purple-400"></div>
                            </div>
                            <div className="h-6 w-6 rounded-md bg-muted flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                            </div>
                            <div className="h-6 w-6 rounded-md bg-muted flex items-center justify-center">
                              <div className="w-3 h-3 rounded-full bg-muted-foreground"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute -bottom-2 -right-2 w-12 h-12 rounded-full bg-card border border-border flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <Sparkles className="text-purple-400" size={20} />
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => setSelectedMethod("generate")}
                      type="button"
                      className="w-full py-3 rounded-xl bg-card hover:bg-purple-500/20 border border-foreground/10 hover:border-purple-500/50 transition-all duration-200 text-muted-foreground hover:text-purple-400 font-medium cursor-pointer"
                    >
                      Generate questions
                    </button>
                  </div>
                </div>
              </div>
            </div>

            {/* Create from scratch card */}
            <div
              className="relative"
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <div
                className={`absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent rounded-3xl transition-opacity duration-300 ${
                  hoveredCard === 2 ? "opacity-100" : "opacity-0"
                }`}
              ></div>
              <div className="relative z-10 border border-border rounded-3xl overflow-hidden h-full transition-all duration-300 hover:border-blue-500/50 group">
                <div className="absolute top-0 left-0 w-full h-1 bg-blue-500 transform origin-left transition-transform duration-300 scale-x-0 group-hover:scale-x-100"></div>

                <div className="p-8 flex flex-col h-full">
                  <div className="mb-6">
                    <div className="w-12 h-12 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-4">
                      <PenTool className="text-blue-400" size={24} />
                    </div>
                    <h3 className="text-2xl font-bold text-foreground mb-2">
                      Create manually
                    </h3>
                    <p className="text-muted-foreground">
                      Design your own questions from scratch
                    </p>
                  </div>

                  <div className="flex-grow flex items-center justify-center">
                    <div className="relative w-40 h-32">
                      <div className="absolute inset-0 bg-card rounded-lg border border-border overflow-hidden">
                        <div className="h-8 w-full bg-blue-500/10 flex items-center px-3">
                          <div className="text-xs font-bold text-blue-400">
                            Question Editor
                          </div>
                        </div>
                        <div className="p-3">
                          <div className="flex items-center space-x-2 mb-3 p-2 bg-background rounded-md">
                            <Search className="text-blue-400" size={14} />
                            <div className="text-xs text-blue-400">
                              Browse question types...
                            </div>
                          </div>

                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 rounded-full bg-blue-500/30"></div>
                              <div className="h-2 w-24 bg-muted rounded-sm"></div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 rounded-full bg-muted"></div>
                              <div className="h-2 w-20 bg-muted rounded-sm"></div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 rounded-full bg-muted"></div>
                              <div className="h-2 w-28 bg-muted rounded-sm"></div>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="absolute -bottom-2 -right-2 w-8 h-8 rounded-full bg-card border border-border flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
                        <div className="w-4 h-4 rounded-full bg-blue-400"></div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <button
                      onClick={() => setSelectedMethod("create")}
                      type="button"
                      className="w-full py-3 rounded-xl bg-card hover:bg-blue-500/20 border border-foreground/10 hover:border-blue-500/50 transition-all duration-200 text-muted-foreground hover:text-blue-400 font-medium cursor-pointer"
                    >
                      Create question
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default DialogAddQuestion;
