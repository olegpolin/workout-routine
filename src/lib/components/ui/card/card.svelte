<script lang="ts">
	import type { HTMLAttributes } from "svelte/elements";
	import { cn, type WithElementRef } from "$lib/utils.js";

	let {
		ref = $bindable(null),
		class: className,
		children,
		size = "default",
		...restProps
	}: WithElementRef<HTMLAttributes<HTMLDivElement>> & { size?: "default" | "sm" } = $props();
</script>

<div
	bind:this={ref}
	data-slot="card"
	data-size={size}
	class={cn("bg-card text-card-foreground gap-6 overflow-hidden rounded-4xl border border-border py-6 text-sm shadow-lg has-[>img:first-child]:pt-0 data-[size=sm]:gap-4 data-[size=sm]:py-4 *:[img:first-child]:rounded-t-4xl *:[img:last-child]:rounded-b-4xl group/card flex flex-col", className)}
	{...restProps}
>
	{@render children?.()}
</div>
