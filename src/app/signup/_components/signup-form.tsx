"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { authClient } from "@/lib/auth-client"
import { encrypt } from '@/lib/security/encrypt'

import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import { useRouter } from "next/navigation"
import axios from 'axios'

const formSchema = z
    .object({
        email: z.email("Digite um e-mail válido."),
        name: z.string("Digite um nome de usuário válido.").min(3, "O nome de usuário precisa ter no mínimo 3 caracteres").max(32, "O nome de usuário não pode ultrapassar 32 caracteres."),
        password: z.string().min(6, "A senha deve ter no mínimo 6 caracteres."),
        confirmPassword: z.string(),
        cpf: z.string("Digite um CPF válido.").min(11, "O CPF precisa ter 11 caracteres.").max(11, "O CPF não pode ultrapassar 11 caracteres."),
        telefone: z.string("Digite um número de telefone válido").min(11, "O número de telefone precisa ter 11 caracteres.").max(11, "O número de telefone não pode ultrapassar 11 caracteres.")
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "As senhas não conferem.",
        path: ["confirmPassword"],
    })

export function SignUpForm() {
    const { push } = useRouter()

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            name: "",
            password: "",
            confirmPassword: "",
            cpf: "",
            telefone: ""
        },
    })

    async function onSubmit(data: z.infer<typeof formSchema>) {
        await authClient.signUp.email({
            email: data.email,
            name: data.name,
            password: data.password
        })

        authClient.signIn.email({
            email: data.email,
            password: data.password
        })

        push("/painel")

        axios.post(`http://localhost:3000/api/update/user/${authClient.useSession().data?.user.id}`,
            {
                cpf: data.cpf,
                phone: data.telefone
            }
        )

        toast.success("Cadastro realizado com sucesso!")
    }

    return (
        <Card className="w-full sm:max-w-md mt-4 border-gray-500">
            <CardHeader>
                <CardTitle className="text-2xl font-bold">Criar conta</CardTitle>
                <CardDescription className="text-gray-500">
                    Preencha os dados abaixo para se cadastrar.
                </CardDescription>
            </CardHeader>

            <CardContent>
                <form id="register-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <FieldGroup>
                        <Controller
                            name="email"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="register-email">
                                        E-mail
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="register-email"
                                        type="email"
                                        placeholder="seu@email.com"
                                        autoComplete="email"
                                        aria-invalid={fieldState.invalid}
                                        className="border-gray-500"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="register-name">
                                        Nome de Usuário
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="register-name"
                                        type="text"
                                        placeholder="John Doe"
                                        autoComplete="email"
                                        aria-invalid={fieldState.invalid}
                                        className="border-gray-500"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="cpf"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="register-cpf">
                                        CPF
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="register-cpf"
                                        type="number"
                                        placeholder="Digite seu CPF (OBS.: Somente números, sem formatação)"
                                        aria-invalid={fieldState.invalid}
                                        className="border-gray-500 no-spin"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="telefone"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="register-telefone">
                                        Telefone
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="register-telefone"
                                        type="number"
                                        placeholder="Digite seu número de telefone (OBS.: Somente números, sem formatação)"
                                        aria-invalid={fieldState.invalid}
                                        className="border-gray-500 no-spin"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="password"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="register-password">
                                        Senha
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="register-password"
                                        type="password"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        aria-invalid={fieldState.invalid}
                                        className="border-gray-500"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />

                        <Controller
                            name="confirmPassword"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="register-confirm-password">
                                        Confirmar senha
                                    </FieldLabel>
                                    <Input
                                        {...field}
                                        id="register-confirm-password"
                                        type="password"
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                        aria-invalid={fieldState.invalid}
                                        className="border-gray-500"
                                    />
                                    {fieldState.invalid && (
                                        <FieldError errors={[fieldState.error]} />
                                    )}
                                </Field>
                            )}
                        />
                    </FieldGroup>
                </form>
            </CardContent>

            <CardFooter>
                <Field orientation="horizontal">
                    <Button
                        type="submit"
                        form="register-form"
                        className="bg-linear-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-xs sm:text-sm px-2 sm:px-4 font-bold w-full text-black"
                    >
                        Cadastrar
                    </Button>
                </Field>
            </CardFooter>
        </Card>
    )
}
