import {
	Toast,
	ToastClose,
	ToastDescription,
	ToastProvider,
	ToastTitle,
	ToastViewport,
} from '@/components/ui/toast';
import { useToast } from '@/components/ui/use-toast';
import React from 'react';

export function Toaster() {
	const { toasts } = useToast();

	return (
		<ToastProvider>
			{toasts.map(({ id, title, description, action, dismiss, update, variant, duration, ...rest }) => {
				// Solo pasar props válidas para el componente Toast de Radix UI
				const toastProps = {
					variant,
					duration,
					// Cualquier otra prop válida que pueda venir en rest
					...Object.fromEntries(
						Object.entries(rest).filter(([key]) => 
							// Excluir funciones y props internas
							typeof rest[key] !== 'function' && 
							key !== 'dismiss' && 
							key !== 'update'
						)
					)
				};
				
				return (
					<Toast key={id} {...toastProps}>
						<div className="grid gap-1">
							{title && <ToastTitle>{title}</ToastTitle>}
							{description && (
								<ToastDescription>{description}</ToastDescription>
							)}
						</div>
						{action}
						<ToastClose />
					</Toast>
				);
			})}
			<ToastViewport />
		</ToastProvider>
	);
}