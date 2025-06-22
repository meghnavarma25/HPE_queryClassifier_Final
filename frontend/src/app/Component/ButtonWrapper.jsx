export const ButtonWrapper = ({ item, selected, onClick }) => {
  return (
    <button
      onClick={onClick}
      className={`
        relative z-0 flex items-center gap-2 overflow-hidden rounded-lg border-[1px] 
        ${selected 
          ? "border-violet-400 text-violet-300 bg-violet-400/10" 
          : "border-zinc-600 text-zinc-300"}
        px-4 py-2 font-semibold uppercase transition-all duration-500
        
        before:absolute before:inset-0
        before:-z-10 before:translate-x-[150%]
        before:translate-y-[150%] before:scale-[2.5]
        before:rounded-[100%] before:bg-violet-300
        before:transition-transform before:duration-1000
        before:content-[""]

        hover:scale-105 hover:text-neutral-900
        hover:before:translate-x-[0%]
        hover:before:translate-y-[0%]
        active:scale-95
      `}
    >
      <span>{item}</span>
    </button>
  );
};
