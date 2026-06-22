import { cn } from "@/lib/utils";

export function SectionHeader({ eyebrow, title, description, align = "left", className }) {
  return (
    <div className={cn("max-w-2xl", align === "center" && "mx-auto text-center", className)}>
      {eyebrow && (
        <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
      )}
      <h2 className="mt-2 text-2xl font-semibold tracking-tight text-foreground md:text-3xl lg:text-4xl">
        {title}
      </h2>
      {description && (
        <p className="mt-3 text-base text-muted-foreground leading-relaxed">{description}</p>
      )}
    </div>
  );
}

export function PageHeader({ eyebrow, title, description }) {
  return (
    <div className="border-b border-border bg-surface">
      <div className="container-page py-12 md:py-16">
        {eyebrow && (
          <p className="text-xs font-semibold uppercase tracking-wider text-primary">{eyebrow}</p>
        )}
        <h1 className="mt-2 text-3xl font-semibold tracking-tight text-foreground md:text-4xl lg:text-5xl">
          {title}
        </h1>
        {description && (
          <p className="mt-4 max-w-2xl text-base text-muted-foreground leading-relaxed md:text-lg">
            {description}
          </p>
        )}
      </div>
    </div>
  );
}
