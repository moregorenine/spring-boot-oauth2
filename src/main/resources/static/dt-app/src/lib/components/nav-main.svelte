<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as Collapsible from '$lib/components/ui/collapsible/index.js';
	import { ChevronRight } from '@lucide/svelte';
	import { type Component } from 'svelte';

	let {
		items
	}: {
		items: {
			title: string;
			url: string;
			icon?: Component;
			isActive?: boolean;
			items?: {
				title: string;
				url: string;
			}[];
		}[];
	} = $props();
</script>

<Sidebar.Group>
	<Sidebar.GroupLabel>Platform</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each items as item}
			<Collapsible.Root open={item.isActive} class="group/collapsible">
				<Sidebar.MenuItem>
					<Collapsible.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuButton {...props} tooltip={item.title}>
								{#if item.icon}
									<item.icon />
								{/if}
								<span>{item.title}</span>
								<ChevronRight
									class="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90"
								/>
							</Sidebar.MenuButton>
						{/snippet}
					</Collapsible.Trigger>
					<Collapsible.Content>
						<Sidebar.MenuSub>
							{#each item.items || [] as subItem}
								<Sidebar.MenuSubItem>
									<Sidebar.MenuSubButton href={subItem.url}>
										<span>{subItem.title}</span>
									</Sidebar.MenuSubButton>
								</Sidebar.MenuSubItem>
							{/each}
						</Sidebar.MenuSub>
					</Collapsible.Content>
				</Sidebar.MenuItem>
			</Collapsible.Root>
		{/each}
	</Sidebar.Menu>
</Sidebar.Group>
