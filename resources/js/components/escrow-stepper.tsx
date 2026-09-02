import { Check, Clock, ShieldCheck } from 'lucide-react';
import { cn } from '@/lib/utils';

export type EscrowStage = 'inspection_paid' | 'inspection_confirmed' | 'rent_paid' | 'agreement_signed' | 'completed';

const stages = [
    { id: 'inspection_paid', label: 'Inspection Paid', desc: 'Fee held in escrow' },
    { id: 'inspection_confirmed', label: 'Inspection Held', desc: 'Visit confirmed' },
    { id: 'rent_paid', label: 'Rent Paid', desc: 'Total rent held in escrow' },
    { id: 'agreement_signed', label: 'Agreement Signed', desc: 'Legal docs signed' },
    { id: 'completed', label: 'Completed', desc: 'Funds released to owner' }
];

export function EscrowStepper({ currentStage, amountHeld }: { currentStage: EscrowStage, amountHeld: string }) {
    const currentIndex = stages.findIndex(s => s.id === currentStage);

    return (
        <div className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-200 shadow-sm mb-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>
            
            <div className="flex items-start justify-between mb-8 relative z-10 flex-col md:flex-row gap-4 md:gap-0">
                <div>
                    <h3 className="text-xl font-extrabold text-slate-900 flex items-center gap-2">
                        <ShieldCheck className="w-6 h-6 text-emerald-500" />
                        Escrow Protection Active
                    </h3>
                    <p className="text-slate-500 font-medium mt-1">Your funds are safe. We only release them when you confirm.</p>
                </div>
                <div className="md:text-right">
                    <p className="text-sm font-bold text-slate-500 uppercase tracking-widest mb-1">Currently Held</p>
                    <p className="text-2xl md:text-3xl font-extrabold text-slate-900">{amountHeld}</p>
                </div>
            </div>

            <div className="relative z-10">
                <div className="absolute top-5 left-[5%] right-[5%] h-1 bg-slate-100 rounded-full z-0 hidden md:block"></div>
                
                <div className="grid grid-cols-1 md:grid-cols-5 gap-6 md:gap-4 relative z-10">
                    {stages.map((stage, index) => {
                        const isCompleted = index <= currentIndex;
                        const isCurrent = index === currentIndex;
                        
                        return (
                            <div key={stage.id} className="flex flex-row md:flex-col items-center md:text-center gap-4 md:gap-0">
                                <div className={cn(
                                    "w-10 h-10 md:w-12 md:h-12 rounded-full flex items-center justify-center shrink-0 transition-colors duration-500 border-4 md:mb-4 relative z-10",
                                    isCompleted ? "bg-emerald-500 border-emerald-100 text-white" : "bg-white border-slate-100 text-slate-300",
                                    isCurrent ? "ring-4 ring-emerald-500/20" : ""
                                )}>
                                    {isCompleted ? <Check className="w-5 h-5 md:w-6 md:h-6" /> : <Clock className="w-5 h-5 md:w-6 md:h-6" />}
                                </div>
                                <div>
                                    <h4 className={cn("text-sm md:text-base font-bold", isCompleted ? "text-slate-900" : "text-slate-400")}>{stage.label}</h4>
                                    <p className="text-xs font-medium text-slate-500 md:mt-1">{stage.desc}</p>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
