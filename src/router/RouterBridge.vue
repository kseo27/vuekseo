<template>
<article :class="[$route.meta.flexible && 'vt-flexible']">
	<RouterView v-slot="{ Component }">
		<component :is="Component" />
	</RouterView>
</article>
</template>