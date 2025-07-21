# Fixing Supabase "new row violates row-level security policy" Error for File Uploads

When uploading a file to Supabase Storage (or inserting into a table), you may encounter the following error:

```
Supabase upload error: {
  statusCode: '403',
  error: 'Unauthorized',
  message: 'new row violates row-level security policy'
}
```

This means Supabase's Row Level Security (RLS) is blocking the operation. Here’s how to systematically diagnose and fix it.

---

## 1. **Understand the Problem**

### 1.1 What is Row Level Security (RLS)?
- RLS is a feature in Supabase/Postgres that restricts which rows a user can access or modify based on policies you define.
- If RLS is enabled and no policy allows the current operation, all access is denied by default.

### 1.2 Why does this error occur?
- The error means your current user/session does not have permission to perform the requested action (insert/upload/update) on the target table or storage bucket.

---

## 2. **Check Authentication**

### 2.1 Ensure the User is Authenticated
- Confirm the user is logged in before attempting the upload.
- In your frontend, check that the user object exists and contains a valid `id` and `email`. [x]

### 2.2 Verify the JWT is Present and Sent
- In your API route, log the JWT received from the frontend.
- Make sure the upload request includes the `Authorization: Bearer <JWT>` header.
- Example (in Node.js):
  ```js
  const jwt = req.headers['x-access-token'] || req.headers['authorization']?.split(' ')[1];
  ```

### 2.3 Validate the JWT
- Use [jwt.io](https://jwt.io/) to decode the JWT and check:
  - The `sub` or `id` matches the user you expect.
  - The token is not expired (`exp` claim).
  - The token is issued by your Supabase project.

### 2.4 Confirm Supabase Session
- In your API route, after getting the session, check that `session.user.id` matches the `userId` you are using for the upload.
- Log both values to ensure they match.

---

## 3. **Check Supabase Storage Bucket Policies**

### 3.1 Open the Supabase Dashboard
- Go to [https://app.supabase.com/](https://app.supabase.com/) and select your project.

### 3.2 Navigate to Storage Buckets
- Click on **Storage** in the sidebar.
- Select the relevant bucket (e.g., `resumes`).

### 3.3 Review Existing Policies
- Click the **Policies** tab for the bucket.
- If there are no policies, or if the default is "No access," you must add a policy.

### 3.4 Add/Update Policy to Allow Uploads
- Click **New Policy**.
- For a user-specific folder structure, use:
  ```sql
  create policy "Allow users to upload their own files"
  on storage.objects
  for insert
  using (
    auth.role() = 'authenticated'
    AND bucket_id = 'resumes'
    AND (storage.foldername(name))[1] = auth.uid()
  );
  ```
- For a more permissive (but less secure) policy:
  ```sql
  create policy "Authenticated users can upload"
  on storage.objects
  for insert
  to authenticated
  using (true);
  ```
- Click **Save Policy** and ensure it is enabled.

### 3.5 Test with a Minimal Policy (for debugging only)
- Temporarily add:
  ```sql
  create policy "Allow all authenticated"
  on storage.objects
  for all
  to authenticated
  using (true);
  ```
- Remove or restrict this policy after confirming uploads work.

---

## 4. **Check Table RLS (If Writing to a Table)**

### 4.1 Open Table Editor
- In the Supabase dashboard, go to **Table Editor** > select your table (e.g., `profiles`).

### 4.2 Check if RLS is Enabled
- Ensure the **Row Level Security** toggle is ON.

### 4.3 Review Existing Policies
- There should be at least one policy for each operation (insert, update, select, delete) you want to allow.

### 4.4 Add/Update Policies for User Access
- For allowing users to upsert their own profile:
  ```sql
  -- Allow users to update their own profile
  create policy "Users can update their own profile"
  on profiles
  for update
  using (id = auth.uid());

  -- Allow users to insert their own profile
  create policy "Users can insert their own profile"
  on profiles
  for insert
  with check (id = auth.uid());
  ```
- Click **Save Policy** and ensure it is enabled.

---

## 5. **Check Supabase Client Usage**

### 5.1 Ensure Correct Supabase Client Initialization
- When making server-side requests, initialize Supabase with the user's JWT:
  ```js
  import { createClient } from '@supabase/supabase-js';
  const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
    global: { headers: { Authorization: `Bearer ${jwt}` } }
  });
  ```

### 5.2 Confirm JWT is Passed in All Requests
- For every request to Supabase (storage or table), ensure the JWT is included in the headers.
- Double-check any custom fetch or API logic.

---

## 6. **Test the Upload Again**

### 6.1 Try Uploading a File
- Use your app’s upload feature to try uploading a file again.

### 6.2 Observe the Result
- If it works, the error should disappear and the file should appear in the bucket.
- If it fails, proceed to the next step.

### 6.3 Check Supabase Logs
- In the Supabase dashboard, go to **Logs** > **API** to see detailed error messages and debug info.

---

## 7. **Debugging Tips**

### 7.1 Add Console Logs
- Log the JWT, user ID, and all relevant request data in your API route.
- Log the response from Supabase for both success and error cases.

### 7.2 Use Supabase SQL Editor for Manual Testing
- In the dashboard, go to **SQL Editor**.
- Try running an insert into `storage.objects` or your table as the user to see if it works.

### 7.3 Check for Policy Conflicts
- If you have multiple policies, ensure none of them conflict or override the intended access.

---

## 8. **Common Pitfalls**

### 8.1 No Policy Exists
- If RLS is enabled but no policy exists, all access is denied by default.

### 8.2 Wrong Folder Structure
- If your policy restricts uploads to a user’s folder, but you upload elsewhere, it will fail.
- Double-check the folder path in your upload code matches the policy logic.

### 8.3 JWT Expired
- If the JWT is expired, Supabase will reject the request.
- Always check the `exp` claim in the JWT.

### 8.4 Wrong Bucket Name
- Make sure the bucket name in your code matches the one in Supabase.

### 8.5 Policy Not Enabled
- After creating a policy, ensure it is enabled (toggle is ON).

---

## 9. **After Fixing**

### 9.1 Tighten Policies
- Once uploads work, remove any overly permissive policies.
- Restrict policies to only allow users to access their own files.

### 9.2 Test with Multiple Users
- Ensure users cannot access or overwrite each other's files.
- Try uploading and accessing files as different users.

### 9.3 Document Your Policies
- Keep a record of your RLS and storage policies for future reference and audits.

---

# Summary Table

| Step | What to Check/Do                                      | Where/How                                 |
|------|------------------------------------------------------|-------------------------------------------|
| 1.1  | Understand RLS and its purpose                       | Supabase docs, this guide                 |
| 2.1  | User is authenticated                                | App logic, API logs                       |
| 2.2  | JWT is present and sent                              | API logs, request headers                 |
| 2.3  | JWT is valid                                         | jwt.io, API logs                          |
| 2.4  | Supabase session matches userId                      | API logs                                  |
| 3.1  | Open Supabase dashboard                              | app.supabase.com                          |
| 3.2  | Navigate to storage bucket                           | Dashboard > Storage                       |
| 3.3  | Review existing policies                             | Bucket > Policies                         |
| 3.4  | Add/update policy for uploads                        | Bucket > Policies > New Policy            |
| 3.5  | Test with minimal policy                             | Bucket > Policies                         |
| 4.1  | Open table editor                                    | Dashboard > Table Editor                  |
| 4.2  | Check if RLS is enabled                              | Table > RLS toggle                        |
| 4.3  | Review existing table policies                       | Table > Policies                          |
| 4.4  | Add/update user access policies                      | Table > Policies > New Policy             |
| 5.1  | Supabase client uses correct JWT                     | Code review                               |
| 5.2  | JWT is passed in all requests                        | Code review, API logs                     |
| 6.1  | Try uploading a file                                 | App UI                                    |
| 6.2  | Observe the result                                   | App UI, API logs                          |
| 6.3  | Check Supabase logs                                  | Dashboard > Logs > API                    |
| 7.1  | Add console logs for debugging                       | API route                                 |
| 7.2  | Use SQL editor for manual testing                    | Dashboard > SQL Editor                    |
| 7.3  | Check for policy conflicts                           | Dashboard > Policies                      |
| 8.1  | No policy exists                                     | Dashboard > Policies                      |
| 8.2  | Wrong folder structure                               | Code review, policy logic                 |
| 8.3  | JWT expired                                          | jwt.io, API logs                          |
| 8.4  | Wrong bucket name                                    | Code review, dashboard                    |
| 8.5  | Policy not enabled                                   | Dashboard > Policies                      |
| 9.1  | Tighten policies after fixing                        | Dashboard > Policies                      |
| 9.2  | Test with multiple users                             | App UI, dashboard                         |
| 9.3  | Document your policies                               | Project documentation                     |

---

# References

- [Supabase Storage Policies](https://supabase.com/docs/guides/storage/security/access-control)
- [Supabase RLS Policies](https://supabase.com/docs/guides/auth/row-level-security)
- [Supabase Auth Docs](https://supabase.com/docs/guides/auth)

---

**If you follow these steps, you should be able to diagnose and fix the "new row violates row-level security policy" error for file uploads in Supabase.** 