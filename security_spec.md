# EuroVidya Security Specification

## Data Invariants
1. **User Dossier Isolation (`/users/{userId}/dossier/{docId}`)**: Only the authenticated user whose `request.auth.uid == userId` may read, create, or update their dossier document (`docId == 'main'`). `ownerUid` must equal `request.auth.uid` and is immutable after creation.
2. **Bounded Arrays & String Limits**: `shortlistedIds` is strictly capped at `<= 50` entries, `likedItemIds` at `<= 100` entries, and every string field enforces explicit `.size()` boundaries to prevent resource exhaustion.
3. **Consultation Inquiry Privacy (`/inquiries/{inquiryId}`)**: Any visitor or signed-in student may submit a validated inquiry (`create` only) with `createdAt == request.time`. If signed in, `userId` must match `request.auth.uid`; if guest, `userId` must equal `""`. Private inquiry PII (`email`, `phone`) is readable (`get`/`list`) only by the owning signed-in user (`existing().userId == request.auth.uid`) and never updatable or deletable by clients.

## Adversarial Payloads Tested ("Dirty Dozen")
1. Unauthenticated read of `/users/uidA/dossier/main` -> DENIED.
2. Cross-user read of `/users/uidB/dossier/main` by `uidA` -> DENIED.
3. Cross-user write with mismatched `ownerUid` -> DENIED.
4. Dossier create with extra shadow field `isAdmin: true` -> DENIED (`hasOnly`).
5. Dossier update attempting to mutate `ownerUid` -> DENIED.
6. Dossier write with `likedItemIds.size() > 100` -> DENIED.
7. Dossier write with `studentName` > 120 chars -> DENIED.
8. Dossier write with client-forged `updatedAt` != `request.time` -> DENIED.
9. Inquiry create spoofing another user's `userId` while guest or signed in -> DENIED.
10. Inquiry create with `message.size() > 1500` or invalid `destinationCountry` -> DENIED.
11. Unauthenticated or cross-user `list` query on `/inquiries` -> DENIED.
12. Client `update` or `delete` on `/inquiries/{inquiryId}` -> DENIED.
