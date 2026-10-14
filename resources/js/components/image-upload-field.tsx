import { useEffect, useId, useRef, useState } from 'react';

type Props = {
    name: string;
    label: string;
    files: File[];
    onChange: (files: File[]) => void;
    savedImages?: string[];
    maxFiles?: number;
    error?: string;
    disabled?: boolean;
};

export default function ImageUploadField({
    name,
    label,
    files,
    onChange,
    savedImages = [],
    maxFiles = 1,
    error,
    disabled = false,
}: Props) {
    const id = useId();
    const input = useRef<HTMLInputElement>(null);
    const [previews, setPreviews] = useState<string[]>([]);
    const [clientError, setClientError] = useState('');
    useEffect(() => {
        const urls = files.map((file) => URL.createObjectURL(file));
        setPreviews(urls);
        if (files.length === 0 && input.current) input.current.value = '';
        return () => urls.forEach((url) => URL.revokeObjectURL(url));
    }, [files]);
    const choose = (event: React.ChangeEvent<HTMLInputElement>) => {
        const chosen = Array.from(event.target.files || []);
        if (
            chosen.some(
                (file) =>
                    !['image/jpeg', 'image/png'].includes(file.type) ||
                    file.size > 5 * 1024 * 1024,
            )
        ) {
            event.target.value = '';
            setClientError(
                'Choose JPG or PNG images no larger than 5 MB each.',
            );
            return;
        }
        const next = maxFiles === 1 ? chosen : [...files, ...chosen];
        if (next.length > maxFiles) {
            event.target.value = '';
            setClientError(
                'Select up to ' + maxFiles + ' new images at a time.',
            );
            return;
        }
        setClientError('');
        onChange(next);
    };
    const problem = clientError || error;
    return (
        <div className="space-y-3">
            <label
                htmlFor={id}
                className="block text-sm font-semibold text-stone-700"
            >
                {label}
            </label>
            <input
                ref={input}
                id={id}
                name={name}
                type="file"
                accept="image/jpeg,image/png"
                multiple={maxFiles > 1}
                onChange={choose}
                disabled={disabled}
                aria-invalid={Boolean(problem)}
                aria-describedby={problem ? id + '-error' : id + '-help'}
                className="block w-full min-w-0 rounded-lg border border-stone-300 bg-white p-3 text-sm text-stone-800 file:mr-3 file:rounded file:border-0 file:bg-emerald-50 file:px-3 file:py-2 file:font-semibold file:text-emerald-900"
            />
            <p id={id + '-help'} className="text-xs text-stone-500">
                JPG or PNG, up to 5 MB each.{' '}
                {maxFiles > 1
                    ? 'New sample images are added to the saved images.'
                    : 'Selecting an image updates your logo when you save.'}
            </p>
            {problem && (
                <p
                    id={id + '-error'}
                    role="alert"
                    className="text-sm text-red-700"
                >
                    {problem}
                </p>
            )}
            {savedImages.length > 0 && (
                <div>
                    <p className="mb-2 text-xs font-semibold text-stone-600">
                        Saved images
                    </p>
                    <div className="grid grid-cols-3 gap-3 sm:grid-cols-5">
                        {savedImages.map((url, index) => (
                            <img
                                key={url + index}
                                src={
                                    /^https?:\/\//.test(url) ||
                                    url.startsWith('/')
                                        ? url
                                        : '/' + url
                                }
                                alt={'Saved image ' + (index + 1)}
                                className="aspect-square w-full rounded-lg border border-stone-200 object-cover"
                            />
                        ))}
                    </div>
                </div>
            )}
            {files.length > 0 && (
                <div>
                    <p className="mb-2 text-xs font-semibold text-stone-600">
                        Ready to upload
                    </p>
                    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        {files.map((file, index) => (
                            <div
                                key={file.name + index}
                                className="min-w-0 rounded-lg border border-stone-200 p-2"
                            >
                                <img
                                    src={previews[index]}
                                    alt={'Preview of ' + file.name}
                                    className="aspect-square w-full rounded object-cover"
                                />
                                <p className="mt-2 truncate text-xs">
                                    {file.name}
                                </p>
                                <button
                                    type="button"
                                    onClick={() => {
                                        setClientError('');
                                        onChange(
                                            files.filter(
                                                (_, current) =>
                                                    current !== index,
                                            ),
                                        );
                                    }}
                                    disabled={disabled}
                                    className="mt-1 text-xs text-red-700 underline"
                                >
                                    Remove selection
                                </button>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
