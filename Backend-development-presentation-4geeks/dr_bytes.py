"""
🤖 DR. BYTES - ASISTENTE EMOCIONAL CLI CON MEMORIA PERSISTENTE
4Geeks Academy - Clase 31: Funciones, Scope y Persistencia de Archivos
"""

import os

ARCHIVO_MEMORIA = "memoria_feliz.txt"


# --- 1. CAPA DE PERSISTENCIA DE ARCHIVOS ---
def guardar_recuerdo_positivo(motivo: str) -> None:
    """
    Guarda un recuerdo positivo en el archivo de texto en modo append ('a').
    """
    try:
        with open(ARCHIVO_MEMORIA, mode="a", encoding="utf-8") as archivo:
            archivo.write(f"{motivo}\n")
        print("💾 [Memoria]: He guardado este recuerdo en mi disco duro.")
    except IOError as error:
        print(f"⚠️ Error al acceder al disco: {error}")


def leer_todos_los_recuerdos() -> list[str]:
    """
    Lee todos los recuerdos almacenados en el archivo de memoria.
    Retorna una lista de strings o una lista vacía si no existe.
    """
    if not os.path.exists(ARCHIVO_MEMORIA):
        return []
    try:
        with open(ARCHIVO_MEMORIA, mode="r", encoding="utf-8") as archivo:
            return [linea.strip() for linea in archivo if linea.strip()]
    except IOError as error:
        print(f"⚠️ Error al leer los recuerdos: {error}")
        return []


def obtener_ultimo_recuerdo() -> str | None:
    """
    Recupera el recuerdo más reciente (última línea del archivo).
    """
    recuerdos = leer_todos_los_recuerdos()
    return recuerdos[-1] if recuerdos else None


# --- 2. CAPA DE LÓGICA DE INTERACCIÓN ---
def procesar_estado_positivo() -> None:
    """
    Gestiona la respuesta cuando el usuario se siente bien.
    """
    print("\n✨ ¡Qué excelente noticia! Me alegra mucho escucharlo.")
    motivo = input("Cuéntame, ¿qué te hizo sentir tan bien?: ").strip()
    if not motivo:
        print("Entendido. ¡Sigue disfrutando tu día! 😊")
        return
    guardar_recuerdo_positivo(motivo)


def procesar_estado_negativo() -> None:
    """
    Gestiona la respuesta cuando el usuario se siente mal, buscando recuerdos felices.
    """
    print("\n🌧️ Lamento mucho que hoy no sea un buen día...")
    ultimo_recuerdo = obtener_ultimo_recuerdo()
    if ultimo_recuerdo:
        print(f'\n💡 No te desanimes. Hace poco me contaste que:\n   👉 "{ultimo_recuerdo}"')
    else:
        print("Aún no tengo recuerdos felices guardados en mi memoria, ¡pero te mando un abrazo digital! 🫂")


# --- 3. BUCLE PRINCIPAL INTERACTIVO ---
def ejecutar_dr_bytes() -> None:
    """
    Bucle principal de la aplicación CLI: continúa preguntando hasta que el usuario decida 'salir'.
    """
    print("=" * 60)
    print("       🤖 DR. BYTES - ASISTENTE EMOCIONAL CLI")
    print("=" * 60)
    
    while True:
        estado = input("\n¿Cómo te sientes hoy? (bien / mal / salir): ").strip().lower()
        
        if estado == "salir":
            print("\n👋 ¡Hasta luego! Gracias por hablar con Dr. Bytes. 🤖💙")
            break
        elif estado == "bien":
            procesar_estado_positivo()
        elif estado == "mal":
            procesar_estado_negativo()
        else:
            print(f"🤔 Opción no reconocida: '{estado}'. Por favor escribe: bien, mal o salir.")


if __name__ == "__main__":
    ejecutar_dr_bytes()
