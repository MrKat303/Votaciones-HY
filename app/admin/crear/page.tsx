"use client";

import { CreateVotingForm } from "@/components/admin/CreateVotingForm";
import { Button } from "@/components/ui/Button";
import Link from "next/link";

export default function CreatePage() {
    return (
        <div className="min-h-screen p-8 max-w-4xl mx-auto flex flex-col items-center justify-center relative">
            <div className="absolute top-8 left-8">
                <Link href="/admin">
                    <Button variant="ghost">← Volver</Button>
                </Link>
            </div>

            <div className="w-full max-w-md">
                <CreateVotingForm />
            </div>
        </div>
    );
}
