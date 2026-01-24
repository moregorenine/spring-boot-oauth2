export type WindowVariant = 'default' | 'alert' | 'fullscreen';

export interface WindowProps {
	open: boolean;
	title?: string;
	variant?: WindowVariant;
	modal?: boolean; // true: 모달 (블러 + 오버레이), false: non-modal (투명 오버레이)
	closeOnOverlay?: boolean;
	closeOnEscape?: boolean;
	width?: string;
	height?: string;
	maxWidth?: string;
	maxHeight?: string;
	onClose?: () => void;
}

export interface WindowTitlebarProps {
	title?: string;
	onClose?: () => void;
	onMaximize?: () => void;
	showMaximize?: boolean;
	isMaximized?: boolean;
	onDragStart?: (e: MouseEvent) => void;
}
