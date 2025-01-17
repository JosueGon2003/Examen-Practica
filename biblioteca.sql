PGDMP     7    &                |         
   biblioteca    15.8    15.8 #               0    0    ENCODING    ENCODING        SET client_encoding = 'UTF8';
                      false                       0    0 
   STDSTRINGS 
   STDSTRINGS     (   SET standard_conforming_strings = 'on';
                      false                        0    0 
   SEARCHPATH 
   SEARCHPATH     8   SELECT pg_catalog.set_config('search_path', '', false);
                      false            !           1262    16618 
   biblioteca    DATABASE        CREATE DATABASE biblioteca WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'Spanish_Ecuador.1252';
    DROP DATABASE biblioteca;
                postgres    false            �            1259    16669 
   categorias    TABLE     g   CREATE TABLE public.categorias (
    id integer NOT NULL,
    nombre character varying(50) NOT NULL
);
    DROP TABLE public.categorias;
       public         heap    postgres    false            �            1259    16668    categorias_id_seq    SEQUENCE     �   CREATE SEQUENCE public.categorias_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 (   DROP SEQUENCE public.categorias_id_seq;
       public          postgres    false    215            "           0    0    categorias_id_seq    SEQUENCE OWNED BY     G   ALTER SEQUENCE public.categorias_id_seq OWNED BY public.categorias.id;
          public          postgres    false    214            �            1259    16691    estudiantes    TABLE        CREATE TABLE public.estudiantes (
    id integer NOT NULL,
    cedula character varying(20) NOT NULL,
    nombre character varying(100),
    apellido character varying(100),
    sexo character(1),
    fecha_nacimiento date,
    sancionado boolean DEFAULT false,
    sancion_hasta date
);
    DROP TABLE public.estudiantes;
       public         heap    postgres    false            �            1259    16690    estudiantes_id_seq    SEQUENCE     �   CREATE SEQUENCE public.estudiantes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 )   DROP SEQUENCE public.estudiantes_id_seq;
       public          postgres    false    219            #           0    0    estudiantes_id_seq    SEQUENCE OWNED BY     I   ALTER SEQUENCE public.estudiantes_id_seq OWNED BY public.estudiantes.id;
          public          postgres    false    218            �            1259    16676    libros    TABLE     f  CREATE TABLE public.libros (
    id integer NOT NULL,
    codigo character varying(50) NOT NULL,
    tipo character varying(20) NOT NULL,
    categoria_id integer NOT NULL,
    editorial character varying(100),
    nombre character varying(100) NOT NULL,
    autor character varying(100),
    anio_publicacion integer,
    disponible boolean DEFAULT true
);
    DROP TABLE public.libros;
       public         heap    postgres    false            �            1259    16675    libros_id_seq    SEQUENCE     �   CREATE SEQUENCE public.libros_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 $   DROP SEQUENCE public.libros_id_seq;
       public          postgres    false    217            $           0    0    libros_id_seq    SEQUENCE OWNED BY     ?   ALTER SEQUENCE public.libros_id_seq OWNED BY public.libros.id;
          public          postgres    false    216            �            1259    16701 	   prestamos    TABLE       CREATE TABLE public.prestamos (
    id integer NOT NULL,
    estudiante_id integer NOT NULL,
    libro_id integer NOT NULL,
    fecha_prestamo date NOT NULL,
    fecha_entrega date NOT NULL,
    fecha_devolucion date,
    sancionado boolean DEFAULT false
);
    DROP TABLE public.prestamos;
       public         heap    postgres    false            �            1259    16700    prestamos_id_seq    SEQUENCE     �   CREATE SEQUENCE public.prestamos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;
 '   DROP SEQUENCE public.prestamos_id_seq;
       public          postgres    false    221            %           0    0    prestamos_id_seq    SEQUENCE OWNED BY     E   ALTER SEQUENCE public.prestamos_id_seq OWNED BY public.prestamos.id;
          public          postgres    false    220            t           2604    16672    categorias id    DEFAULT     n   ALTER TABLE ONLY public.categorias ALTER COLUMN id SET DEFAULT nextval('public.categorias_id_seq'::regclass);
 <   ALTER TABLE public.categorias ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    214    215    215            w           2604    16694    estudiantes id    DEFAULT     p   ALTER TABLE ONLY public.estudiantes ALTER COLUMN id SET DEFAULT nextval('public.estudiantes_id_seq'::regclass);
 =   ALTER TABLE public.estudiantes ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    219    218    219            u           2604    16679 	   libros id    DEFAULT     f   ALTER TABLE ONLY public.libros ALTER COLUMN id SET DEFAULT nextval('public.libros_id_seq'::regclass);
 8   ALTER TABLE public.libros ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    216    217    217            y           2604    16704    prestamos id    DEFAULT     l   ALTER TABLE ONLY public.prestamos ALTER COLUMN id SET DEFAULT nextval('public.prestamos_id_seq'::regclass);
 ;   ALTER TABLE public.prestamos ALTER COLUMN id DROP DEFAULT;
       public          postgres    false    220    221    221                      0    16669 
   categorias 
   TABLE DATA           0   COPY public.categorias (id, nombre) FROM stdin;
    public          postgres    false    215   (                 0    16691    estudiantes 
   TABLE DATA           v   COPY public.estudiantes (id, cedula, nombre, apellido, sexo, fecha_nacimiento, sancionado, sancion_hasta) FROM stdin;
    public          postgres    false    219   S(                 0    16676    libros 
   TABLE DATA           x   COPY public.libros (id, codigo, tipo, categoria_id, editorial, nombre, autor, anio_publicacion, disponible) FROM stdin;
    public          postgres    false    217   i)                 0    16701 	   prestamos 
   TABLE DATA           }   COPY public.prestamos (id, estudiante_id, libro_id, fecha_prestamo, fecha_entrega, fecha_devolucion, sancionado) FROM stdin;
    public          postgres    false    221   �+       &           0    0    categorias_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.categorias_id_seq', 4, true);
          public          postgres    false    214            '           0    0    estudiantes_id_seq    SEQUENCE SET     A   SELECT pg_catalog.setval('public.estudiantes_id_seq', 44, true);
          public          postgres    false    218            (           0    0    libros_id_seq    SEQUENCE SET     <   SELECT pg_catalog.setval('public.libros_id_seq', 70, true);
          public          postgres    false    216            )           0    0    prestamos_id_seq    SEQUENCE SET     ?   SELECT pg_catalog.setval('public.prestamos_id_seq', 74, true);
          public          postgres    false    220            |           2606    16674    categorias categorias_pkey 
   CONSTRAINT     X   ALTER TABLE ONLY public.categorias
    ADD CONSTRAINT categorias_pkey PRIMARY KEY (id);
 D   ALTER TABLE ONLY public.categorias DROP CONSTRAINT categorias_pkey;
       public            postgres    false    215            �           2606    16697    estudiantes estudiantes_pkey 
   CONSTRAINT     Z   ALTER TABLE ONLY public.estudiantes
    ADD CONSTRAINT estudiantes_pkey PRIMARY KEY (id);
 F   ALTER TABLE ONLY public.estudiantes DROP CONSTRAINT estudiantes_pkey;
       public            postgres    false    219            ~           2606    16682    libros libros_pkey 
   CONSTRAINT     P   ALTER TABLE ONLY public.libros
    ADD CONSTRAINT libros_pkey PRIMARY KEY (id);
 <   ALTER TABLE ONLY public.libros DROP CONSTRAINT libros_pkey;
       public            postgres    false    217            �           2606    16707    prestamos prestamos_pkey 
   CONSTRAINT     V   ALTER TABLE ONLY public.prestamos
    ADD CONSTRAINT prestamos_pkey PRIMARY KEY (id);
 B   ALTER TABLE ONLY public.prestamos DROP CONSTRAINT prestamos_pkey;
       public            postgres    false    221            �           2606    16685    libros libros_categoria_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.libros
    ADD CONSTRAINT libros_categoria_id_fkey FOREIGN KEY (categoria_id) REFERENCES public.categorias(id);
 I   ALTER TABLE ONLY public.libros DROP CONSTRAINT libros_categoria_id_fkey;
       public          postgres    false    215    3196    217            �           2606    16708 &   prestamos prestamos_estudiante_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.prestamos
    ADD CONSTRAINT prestamos_estudiante_id_fkey FOREIGN KEY (estudiante_id) REFERENCES public.estudiantes(id);
 P   ALTER TABLE ONLY public.prestamos DROP CONSTRAINT prestamos_estudiante_id_fkey;
       public          postgres    false    3200    221    219            �           2606    16713 !   prestamos prestamos_libro_id_fkey    FK CONSTRAINT     �   ALTER TABLE ONLY public.prestamos
    ADD CONSTRAINT prestamos_libro_id_fkey FOREIGN KEY (libro_id) REFERENCES public.libros(id);
 K   ALTER TABLE ONLY public.prestamos DROP CONSTRAINT prestamos_libro_id_fkey;
       public          postgres    false    3198    221    217               ;   x�3���,I-J,)-J�2�N�)M�2���K�/�=��$39�˄ӵ��f 3�+F��� ͈!           x�M��j�0E����2#��e	M!ĥ���lD��c9���;����ęÝ[�jj�%˄�p�2D��-4+���CW�GU0�I���*�7�ݯݺA�*%�3�o�F�F�����Aވ/���0�5\nZ��*2J�Ė�$�x�ܪ�S�jŬ�=B�L��~f�)����It��3����qr�)'�*�'i�i�y�d�r�wsJb�J�/��$�B�=>C�~N�FQ)�%V
�(��[��Bt���o�i}|*��lji}           x�M�͎�0���S��"�ɑR[AK�R/��W�M��V��p졪*!/�1,ho�(���c��8NX�g�[��HGEg���>R�'�s���V����m��A�Gq� ��KSX�-9Ha*u��U^���ؠm�-����-DUV���,ϋ��ac��}����Y��?\���b��> ,��S&�&���C��2����ٍ��7m�	�lKNvu�Y�@�y�V���k�]��z�(I�����V�-v��b�G�I���l�u�ш��9ǉV����+�;�$J��4+�!���џ�g�^8��`pUU�½�����B����xX9���c���Q��w"�7�/#����1�Y���Mk+e���b�V�F�]�,Px4�'��,^�R
=������~����wk��9���aEnO\�-aNauj�t�ŵ�[� +f�PeYUo��5�)�����~y�Q5q���v�bî���i��n�C@�F��b�\==N��5��f{c>��|f4;d��o���>��-�         _   x��α�0�v�/�$K8Aj�Ahb��Gs�wX#�CFI��ی���tr��R�;"dv�W������A�ߝ*!�w�9���V���ؘ�w1�     