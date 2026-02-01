<script lang="ts">
    import { onMount } from 'svelte';
    import type { HTMLButtonAttributes } from 'svelte/elements';

    interface Props extends HTMLButtonAttributes {
        text?: string;
        fontSize?: number;
        className?: string;
        sunken?: boolean;
        pressed?: boolean;
        blink?: boolean;
        fallbackWidth: number;
    }

    let { text = ">PRESS ENTER", fontSize = 32, sunken = false, fallbackWidth = 0, pressed = false, blink = true, className = "", ...rest }: Props = $props();

    let buttonEl: HTMLButtonElement;
    let textEl: SVGTextElement;

    export function click() {
        buttonEl?.click();
    }
    let svgWidth = $state(fallbackWidth);

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

<button bind:this={buttonEl} class="boba-container {className}" class:pressed class:blink {...rest}>
    <svg width={svgWidth || 'auto'} height={fontSize + 10} overflow="visible" fill="none" xmlns="http://www.w3.org/2000/svg">
        <text class="boba-shadow" class:sunken={sunken} stroke="black" style="white-space: pre; paint-order: stroke" stroke-width="10" stroke-linejoin="round" xml:space="preserve" font-family="Cook Widetype" font-size={fontSize} font-weight="600" letter-spacing="0em"><tspan x="5" y={fontSize}>{text}</tspan></text>
        <text class="front" class:sunken={sunken} bind:this={textEl} fill="black" stroke="#F9F3EB" style="white-space: pre; paint-order: stroke" stroke-width="6" stroke-linejoin="round" xml:space="preserve" font-family="Cook Widetype" font-size={fontSize} font-weight="600" letter-spacing="0em"><tspan x="5" y={fontSize}>{text}</tspan></text>
    </svg>
</button>

<style>
    .boba-container {
        display: inline-block;
    }

    .boba-container.blink {
        animation: blink 1s ease-in-out infinite;
    }

    .boba-container.blink:active,
    .boba-container.blink.pressed {
        animation: none;
    }

    @keyframes blink {
        0%, 100% {
            opacity: 1;
        }
        50% {
            opacity: 0.4;
        }
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

    button:hover, button:focus {
        .boba-shadow {
            filter: drop-shadow( 6px 6px 0px rgba(0, 0, 0, 1));
            transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.15s ease;         
            transform: translate(-3px, -3px);
        }

        .front {
            transform: translate(-3px, -3px);
        }    

        outline: none;
    }

    button:active, button.pressed {
        .boba-shadow {
            filter: drop-shadow( 0px 0px 0px rgba(0, 0, 0, 1));
            transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), filter 0.15s ease;         
            transform: translate(3px, 3px);
        }

        .front {
            transform: translate(3px, 3px);
        }    
    }

    
</style>