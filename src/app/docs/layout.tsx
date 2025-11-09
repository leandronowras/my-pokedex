import { source } from "~/lib/source";
import { DocsLayout } from "fumadocs-ui/layouts/docs";
import { RootProvider } from "fumadocs-ui/provider";
import type { ReactNode } from "react";

export default function Layout({ children }: { children: ReactNode }) {
	return (
		<RootProvider>
			<DocsLayout tree={source.pageTree} nav={{ title: "Pokédex Docs" }}>
				{children}
			</DocsLayout>
		</RootProvider>
	);
}
