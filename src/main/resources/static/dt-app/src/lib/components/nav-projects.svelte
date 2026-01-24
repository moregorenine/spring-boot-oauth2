<script lang="ts">
	import * as Sidebar from '$lib/components/ui/sidebar/index.js';
	import * as DropdownMenu from '$lib/components/ui/dropdown-menu/index.js';
	import { base } from '$app/paths';
	import { Folder, Forward, MoreHorizontal, Trash2 } from '@lucide/svelte';
	import { type Component } from 'svelte';

	let {
		projects
	}: {
		projects: {
			name: string;
			url: string;
			icon: Component;
		}[];
	} = $props();
</script>

<Sidebar.Group class="group-data-[collapsible=icon]:hidden">
	<Sidebar.GroupLabel>Projects</Sidebar.GroupLabel>
	<Sidebar.Menu>
		{#each projects as project}
			<Sidebar.MenuItem>
				<Sidebar.MenuButton>
					{#snippet child({ props })}
						<a href={base + project.url} {...props}>
							<project.icon />
							<span>{project.name}</span>
						</a>
					{/snippet}
				</Sidebar.MenuButton>
				<DropdownMenu.Root>
					<DropdownMenu.Trigger>
						{#snippet child({ props })}
							<Sidebar.MenuAction showOnHover {...props}>
								<MoreHorizontal />
								<span class="sr-only">More</span>
							</Sidebar.MenuAction>
						{/snippet}
					</DropdownMenu.Trigger>
					<DropdownMenu.Content class="w-48 rounded-lg" side="bottom" align="end">
						<DropdownMenu.Item>
							<Folder class="text-muted-foreground" />
							<span>View Project</span>
						</DropdownMenu.Item>
						<DropdownMenu.Item>
							<Forward class="text-muted-foreground" />
							<span>Share Project</span>
						</DropdownMenu.Item>
						<DropdownMenu.Separator />
						<DropdownMenu.Item>
							<Trash2 class="text-muted-foreground" />
							<span>Delete Project</span>
						</DropdownMenu.Item>
					</DropdownMenu.Content>
				</DropdownMenu.Root>
			</Sidebar.MenuItem>
		{/each}
		<!-- <Sidebar.MenuItem>
			<Sidebar.MenuButton class="text-sidebar-foreground/70">
				<MoreHorizontal class="text-sidebar-foreground/70" />
				<span>More</span>
			</Sidebar.MenuButton>
		</Sidebar.MenuItem> -->
	</Sidebar.Menu>
</Sidebar.Group>
