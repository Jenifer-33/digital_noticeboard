-- Create storage buckets
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES 
    ('covers', 'covers', true, 2097152, ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']),
    ('attachments', 'attachments', true, 2097152, ARRAY['application/pdf', 'image/jpeg', 'image/png', 'image/webp', 'image/gif', 'text/plain', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']);

-- Storage policies for covers bucket
CREATE POLICY "Covers are publicly readable" ON storage.objects
    FOR SELECT USING (bucket_id = 'covers');

CREATE POLICY "Authenticated users can upload covers" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'covers' AND 
        auth.role() = 'authenticated'
    );

CREATE POLICY "Admins can update covers" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'covers' AND
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete covers" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'covers' AND
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

-- Storage policies for attachments bucket
CREATE POLICY "Attachments are publicly readable" ON storage.objects
    FOR SELECT USING (bucket_id = 'attachments');

CREATE POLICY "Authenticated users can upload attachments" ON storage.objects
    FOR INSERT WITH CHECK (
        bucket_id = 'attachments' AND 
        auth.role() = 'authenticated'
    );

CREATE POLICY "Admins can update attachments" ON storage.objects
    FOR UPDATE USING (
        bucket_id = 'attachments' AND
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );

CREATE POLICY "Admins can delete attachments" ON storage.objects
    FOR DELETE USING (
        bucket_id = 'attachments' AND
        EXISTS (
            SELECT 1 FROM public.users 
            WHERE id = auth.uid() AND role = 'admin'
        )
    );
