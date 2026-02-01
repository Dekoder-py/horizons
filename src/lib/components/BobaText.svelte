<script lang="ts">
    import { onMount } from 'svelte';

    interface Props {
        text?: string;
        fontSize?: number;
    }

    let { text = ">PRESS ENTER", fontSize = 32 }: Props = $props();

    let textEl: SVGTextElement;
    let svgWidth = $state(0);

    onMount(() => {
        updateWidth();
    });

    function updateWidth() {
        if (textEl) {
            const bbox = textEl.getBBox();
            svgWidth = bbox.width + 20;
        }
    }

    $effect(() => {
        text;
        fontSize;
        updateWidth();
    });
</script>

<div class="boba-container">
    <svg width={svgWidth || 'auto'} height={fontSize + 10} overflow="visible" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text class="boba-shadow" stroke="black" style="white-space: pre; paint-order: stroke" stroke-width="10" stroke-linejoin="round" xml:space="preserve" font-family="Cook Widetype" font-size={fontSize} font-weight="600" letter-spacing="0em"><tspan x="5" y={fontSize}>{text}</tspan></text>
        <text class="front" bind:this={textEl} fill="black" stroke="#F9F3EB" style="white-space: pre; paint-order: stroke" stroke-width="6" stroke-linejoin="round" xml:space="preserve" font-family="Cook Widetype" font-size={fontSize} font-weight="600" letter-spacing="0em"><tspan x="5" y={fontSize}>{text}</tspan></text>
    </svg>
</div>

<style>
    .boba-container {
        display: inline-block;
    }
    
    .boba-container svg {
        display: block;
    }

    .boba-shadow {
        -webkit-filter: drop-shadow( 3px 3px 0px rgba(0, 0, 0, 1));
        
        filter: drop-shadow( 3px 3px 0px rgba(0, 0, 0, 1));
        transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.15s ease;
    }

    .front {
    	transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1);
    }
</style>