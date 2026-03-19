import React from "react";

const PageHeader = ({ title }) => {
  // Split the title into an array of words
  const words = title.split(" ");

  return (
    <div>
      <header className="mb-12">
        {/* <div className="flex items-center gap-3 mb-3">
          <span className="h-[2px] w-10 bg-primary rounded-full" />
          <span className="text-primary font-bold uppercase tracking-[0.3em] text-[10px]">
            System Core / Hero
          </span>
        </div> */}

        <h1 className="text-4xl font-bold tracking-tighter">
          {words[0]}{" "}
          <span className="text-muted-foreground ">
            {words.slice(1).join(" ")}
          </span>
        </h1>
      </header>
    </div>
  );
};

export default PageHeader;
