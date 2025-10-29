import { Session } from '@supabase/supabase-js';
import { supabase } from '../scripts/supabaseClient';
import { OverlayPanel } from 'primereact/overlaypanel';
import { Dispatch, RefObject } from 'react';

// Type Imports
import { WorkItem } from '../types/work-item';

// Interface Defintion
interface submitWorkItemProps {
    op: RefObject<OverlayPanel | null>;
    text: string;
    color: string;
    session: Session | null;
    setColor: Dispatch<React.SetStateAction<string>>;
    setText: Dispatch<React.SetStateAction<string>>;
    setWorkItems: Dispatch<React.SetStateAction<WorkItem[]>>;
}

export const submitWorkItem = async ({ op, text, color, session, setColor, setText, setWorkItems }: submitWorkItemProps) => {
    if (!session || !session.user?.email) return;

    if (!text || !color) {
        console.warn("Text or color is empty. Cannot submit.");
        return;
    }

    try {
        // eslint-disable-next-line
        const { data, error } = await supabase
            .from("study_work_items")
            .insert([
                {
                    work_item: text,
                    color: color,
                    user_id: session.user.email,
                },
            ]);

        const workitems = await fetchWorkItems(session);
        setWorkItems(workitems ?? []);

        if (error) {
            console.error("Error creating work item:", error);
            return;
        }

        // Close the overlay
        op.current?.hide();

        // Reset input fields
        setText("");
        setColor("000000");

    } catch (err) {
        console.error("Unexpected error creating work item:", err);
    }
};

// TODO: Move this over to the server
export const fetchWorkItems = async (
    session: Session | null
): Promise<WorkItem[] | undefined> => {
    if (!session || !session.user?.email) return;

    try {
        const { data, error } = await supabase
            .from("study_work_items")
            .select("work_item, color")
            .eq("user_id", session.user.email);

        if (error) {
            console.error("Error fetching work items:", error);
            return;
        }

        return data.map(row => ({
            work_item: row.work_item,
            color: row.color,
        }));
    } catch (err) {
        console.error("Unexpected error fetching work items:", err);
    }
};

// TODO: Delete WORK ITEM
export const deleteWorkItem = async (
    session: Session | null,
    setWorkItems: Dispatch<React.SetStateAction<WorkItem[]>>,
    work_item: string
) => {
    if (!session || !session.user?.email) {
        console.warn("No session or user found, cannot delete.");
        return false;
    }

    try {
        console.log("Attempting to delete work item:", work_item, "for user:", session.user.email);
        const { error } = await supabase
            .from("study_work_items")
            .delete()
            .eq("work_item", work_item)       // match the work_item
            .eq("user_id", session.user.email); // ✅ also match the user_id

        if (error) {
            console.error("Error deleting work item:", error);
            return false;
        }

        // Refresh items after delete
        const workitems = await fetchWorkItems(session);
        setWorkItems(workitems ?? []);

        return true;
    } catch (err) {
        console.error("Unexpected error deleting work item:", err);
        return false;
    }
};