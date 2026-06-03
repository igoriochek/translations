interface ProductImageUploaderProps {
	onAdd: (files: File[]) => void;
}

export default function ProductImageUploader({onAdd}: ProductImageUploaderProps) {
	function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
		if (!event.target.files)
			return;

		onAdd(Array.from(event.target.files));
		event.target.value = '';
	}

	return (
		<label
			className="
				flex
				items-center
				justify-center
				border-2
				border-dashed
				border-zinc-200
				rounded-xl
				p-8
				cursor-pointer
				hover:bg-zinc-50"
		>
			<input type="file" multiple accept="image/*" className="hidden" onChange={handleChange}/>
			<span>Upload Images</span>
		</label>
	);
}